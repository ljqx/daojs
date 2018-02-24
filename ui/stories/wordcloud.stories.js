import React from 'react';
import { storiesOf } from '../.storybook/facade';
import WordCloud from '../src/component/wordcloud';

const source = [
  ['name', 'value'],
  ['life', 115835],
  ['photography', 78562],
  ['steemit', 62453],
  ['blog', 45831],
  ['art', 38690],
  ['bitcoin', 32495],
  ['nature', 29032],
  ['cryptocurrency', 27722],
  ['story', 27675],
  ['travel', 25752],
  ['busy', 24354],
  ['news', 23617],
  ['steem', 22315],
  ['funny', 21568],
  ['writing', 20074],
  ['introduceyourself', 19844],
  ['indonesia', 18490],
  ['food', 17766],
  ['photo', 16985],
  ['spanish', 16761],
  ['crypto', 16632],
  ['aceh', 16433],
  ['money', 16345],
  ['love', 14900],
  ['dtube', 14315],
  ['kr', 13415],
  ['new', 12226],
  ['meme', 11889],
  ['video', 11603],
  ['music', 11310],
  ['blockchain', 10737],
  ['cervantes', 9595],
  ['health', 9575],
  ['fun', 8545],
  ['entertainment', 8464],
  ['poetry', 7916],
  ['steepshot', 7629],
  ['cn', 7616],
  ['nigeria', 7558],
  ['technology', 7499],
  ['dmania', 7459],
  ['science', 7434],
  ['philippines', 7191],
  ['contest', 6367],
  ['politics', 6231],
  ['colorchallenge', 6112],
  ['kr-newbie', 5960],
  ['drawing', 5716],
  ['history', 5567],
  ['motivation', 4845],
  ['utopian-io', 4722],
  ['animals', 4627],
  ['venezuela', 4606],
  ['esteem', 4542],
  ['gaming', 4462],
  ['ethereum', 4392],
  ['education', 4267],
  ['beauty', 4147],
  ['tr', 4146],
  ['animal', 4051],
  ['stach', 3909],
  ['deutsch', 3884],
  ['philosophy', 3859],
  ['sport', 3837],
  ['whalepower', 3824],
  ['creativity', 3699],
  ['community', 3672],
  ['dlive', 3647],
  ['sports', 3614],
  ['promo-steem', 3500],
  ['trading', 3482],
  ['world', 3414],
  ['untalented', 3368],
  ['introducemyself', 3346],
  ['ico', 3345],
  ['youtube', 3307],
  ['sevendaybnwchallenge', 3198],
  ['family', 3176],
  ['natural', 3163],
  ['flower', 3097],
  ['ksi', 3091],
  ['india', 2985],
  ['photofeed', 2964],
  ['btc', 2959],
  ['poem', 2925],
  ['adventure', 2911],
  ['steemph', 2892],
  ['smartphonephotography', 2843],
  ['vincentb', 2843],
  ['inspiration', 2783],
  ['painting', 2776],
  ['castellano', 2760],
  ['fiction', 2731],
  ['business', 2643],
  ['religion', 2634],
  ['freedom', 2548],
  ['humor', 2492],
];

storiesOf('Wordcloud Chart', module)
  .add('wordcloud chart', () => (
    <WordCloud source={source} />
  ));
