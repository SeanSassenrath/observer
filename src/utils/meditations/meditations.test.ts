import {getTopFiveMeditationIds} from './meditations';

const meditationInstanceCounts = {
  'm-botec-2': {
    count: 1,
    id: 'm-botec-2',
    name: 'Blessing of the Energy Centers 02',
  },
  'm-generating-abundance': {
    count: 2,
    id: 'm-generating-abundance',
    name: 'Generating Abundance',
  },
};

describe('Meditation Utils', () => {
  test('It should return the top five meditation ids for the user', () => {
    const topFiveMeditationIds = getTopFiveMeditationIds(
      meditationInstanceCounts,
    );

    const expectedResult = ['m-generating-abundance', 'm-botec-2'];

    expect(topFiveMeditationIds).toEqual(expectedResult);
  });
});
