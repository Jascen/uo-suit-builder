import { Injectable } from '@angular/core';
import { Item, ItemSlot } from '../state/models/item-collection.models';
import { SuitScoringOptions } from '../state/models/suit-builder.models';
import { Suit } from 'src/app/state/models/suit-collection.models';
import { StatConfiguration } from '../state/models/suit-config.models';
import { copyObjectKeys } from '../utilities/object.utilities';


export enum BuilderAlgorithmType {
  BestScore,
  UncommonProperties
}

@Injectable({
  providedIn: 'root'
})
export class SuitBuilderService {

  createSuits(algorithm: BuilderAlgorithmType, itemsByType: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]) {
    switch (algorithm) {
      case BuilderAlgorithmType.UncommonProperties:
        return this.chooseUncommonProperties(itemsByType, suitConfigOptions);

      case BuilderAlgorithmType.BestScore:
        return this.createSuitIncrementally(itemsByType, suitConfigOptions);

      default:
        return [];
    }
  }

  private createSuitIncrementally(itemsByType: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]): Suit[] {
    const suits = [] as Suit[];
    const iterations = 10;
    for (let index = 0; index < iterations; index++) {
      // Build source suit via best score
      const emptySuit = copyObjectKeys<Item>(itemsByType);
      const sourceSuit = this.chooseBestScoreRecursive(emptySuit, itemsByType, suitConfigOptions);

      // Vary the suit
      const suitVariations = this.createSuitVariations(sourceSuit, itemsByType, suitConfigOptions);

      // Add suits
      suitVariations.forEach(suit => suits.push(suit));

      // Remove all pieces for the suit that was used to seed everything so next iteration does not rebuild the same suit
      Object.keys(itemsByType).forEach(key => {
        const itemSlot = key as ItemSlot;
        const targetItem = sourceSuit.items.find(item => item.slot === itemSlot);
        itemsByType[itemSlot] = itemsByType[itemSlot].filter(item => item !== targetItem);
      });
    }

    return suits;
  }

  private createSuitVariations(startingSuit: Suit, itemsByType: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]) {
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
        const suitWithoutItem = this.chooseBestScoreRecursive({ ...emptySuit }, filteredItemsByType, suitConfigOptions);
        suits.push(suitWithoutItem);
      }

      // Start with this item when building the suit
      const suitStartingItem = this.chooseBestScoreRecursive({
        ...emptySuit,
        [suitItem.slot]: suitItem
      }, itemsByType, suitConfigOptions);
      suits.push(suitStartingItem);
    });

    return suits;
  }

  private chooseUncommonProperties(itemsBySlot: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]): Suit[] {
    const uncommonProperties = suitConfigOptions.reduce((acc, property) => {
      if (!property.commonProperty) {
        acc[property.id] = property;
      }
      return acc;
    }, {} as Record<string, StatConfiguration>);

    const itemsWithUncommonPropertiesBySlot = Object.values(itemsBySlot).reduce((acc, items) => {
      items.forEach((item) => {
        if (Object.keys(item.properties).some(propertyId => !!uncommonProperties[propertyId])) {
          acc[item.slot] ??= [];
          acc[item.slot].push(item);
        }
      });

      return acc;
    }, {} as Record<ItemSlot, Item[]>);

    return Object.values(itemsWithUncommonPropertiesBySlot).reduce((acc, items) => {
      items.forEach(item => {
        // Start the suit with every item that has an uncommon property
        const suit = copyObjectKeys<Item>(itemsBySlot);
        suit[item.slot] = item;

        const sourceSuit = this.chooseBestScoreRecursive(suit, itemsWithUncommonPropertiesBySlot, suitConfigOptions);
        if (sourceSuit) {
          acc.push(sourceSuit);
        }
      });

      return acc;
    }, [] as Suit[]);
  }

  private chooseBestScoreRecursive(suit: Record<ItemSlot, Item>, itemsBySlot: Record<ItemSlot, Item[]>, suitConfigOptions: StatConfiguration[]): Suit {
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

        // Choose if no previous value or the score is better
        return !slotCandidate || itemCandidate?.score < slotCandidate.score ? itemCandidate : slotCandidate;
      }, null);

    if (!slotWinner) { return null; }

    // Assign the item to the Suit
    const item = slotWinner.items[slotWinner.items.length - 1];
    suit[item.slot] = item;

    return this.chooseBestScoreRecursive(suit, itemsBySlot, suitConfigOptions) ?? slotWinner;
  }

  private tryCreateSuit(
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
