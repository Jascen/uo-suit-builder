import { Injectable } from '@angular/core';
import { Item, ItemSlot } from '../state/models/item-collection.models';
import { Suit, SuitScoringOptions } from '../state/models/suit-builder.models';
import { StatConfiguration } from '../state/models/suit-config.models';
import { copyObjectKeys } from '../utilities/object.utilities';


@Injectable({
  providedIn: 'root'
})
export class SuitBuilderService {

  createSuitIncrementally(itemsByType: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]) {
    const emptySuit = copyObjectKeys<Item>(itemsByType);

    return this.chooseLowestCostRecursive(emptySuit, itemsByType, suitConfigOptions);
  }

  createSuitVariations(startingSuit: Suit, itemsByType: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]) {
    const emptySuit = copyObjectKeys<Item, ItemSlot>(itemsByType);

    const suits = [] as Suit[];
    Object.values(startingSuit.items).forEach(suitItem => {
      const items = itemsByType[suitItem.slot];

      // If alternate items exist, exclude this one as an option and build the suit
      if (1 < items.length) {
        const filteredItemsByType = {
          ...itemsByType,
          [suitItem.slot]: items.filter(item => item.id !== suitItem.id)
        };
        const suitWithoutItem = this.chooseLowestCostRecursive({ ...emptySuit }, filteredItemsByType, suitConfigOptions);
        suits.push(suitWithoutItem);
      }

      // Start with this item when building the suit
      const suitStartingItem = this.chooseLowestCostRecursive({
        ...emptySuit,
        [suitItem.slot]: suitItem
      }, itemsByType, suitConfigOptions);
      suits.push(suitStartingItem);
    });

    return suits;
  }

  private createSuitSummary(suit: Record<ItemSlot, Item>) {
    return Object.values(suit).reduce((acc, item) => {
      Object.entries(item.properties).forEach(([id, value]) => {
        acc[id] ??= 0;
        acc[id] += value;
      })
      return acc;
    }, {} as Record<string, number>);
  }

  private chooseLowestCostRecursive(suit: Record<ItemSlot, Item>, itemsBySlot: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]): Suit {
    // Iterate all the slots that are missing items
    const slotWinner = Object.entries(suit)
      .map((([slot, item]) => !item ? itemsBySlot[slot as ItemSlot] : []))
      .sort((a, b) => a.length - b.length)
      .reduce<Suit>((slotCandidate, items) => {
        // Iterate all the items for that slot. Find the best score.
        const itemCandidate = items.reduce((acc, item) => {
          const suitItems = Object.values(suit).filter(item => !!item);
          const scoredSuit = this.tryCreateSuit(item, suitItems, suitConfigOptions, false, { mustMeetAllMinimums: false });
          if (!scoredSuit) { return acc; }

          return !acc || acc.score < scoredSuit.score ? scoredSuit : acc;
        }, null as Suit);

        return !slotCandidate || itemCandidate?.score < slotCandidate.score ? itemCandidate : slotCandidate;
      }, null);

    if (!slotWinner) { return null; }

    const item = slotWinner.items[slotWinner.items.length - 1];
    suit[item.slot] = item;

    return this.chooseLowestCostRecursive(suit, itemsBySlot, suitConfigOptions) ?? slotWinner;
  }

  tryCreateSuit(
    item: Item,
    suit: Item[],
    suitConfigOptions: StatConfiguration[],
    isCompleteSuit: boolean,
    options: SuitScoringOptions
  ) {
    let score = 0;
    const summary = {} as Record<string, number>;

    if (options.requiredProperties?.some(option => !item.properties[option.id]
      || (isCompleteSuit && suit.some(suitItem => !suitItem.properties[option.id])))) { return null; }

    const allPass = suitConfigOptions.every(property => {
      let value = item.properties[property.id] ?? 0;
      suit.forEach(item => value += item.properties[property.id] ?? 0);

      if (isCompleteSuit && options.mustMeetAllMinimums) {
        if (value < property.minimum) { return false; }
      } else {
        if (value === 0) { return true; } // No reason to score or track the property
      }

      summary[property.id] = value;

      if (property.target <= value) {
        // Score up to the target
        score += property.scalingFactor * property.target;

        if (property.maximum < value) {
          // Penalize for being over maximum
          score -= (property.scalingFactor / 2) * (value - property.maximum);
        } else {
          // 1/2 or 1/4 benefit for target -> maximum
          score += (property.scalingFactor / 4) * (value - property.target); // Half benefit
        }
      } else {
        // Score up to the value
        score += property.scalingFactor * value;
      }

      return true;
    });

    if (!allPass) { return null; }

    return {
      score,
      items: [...suit, item],
      summary
    } as Suit;
  }

}
