// import Background from './images/backgrounds/FridaIronbellows.jpg';
import Headshot from './images/headshots/StormwallBlockade.jpg';

export default {
  id: 2280,
  name: 'Stormwall Blockade', // Horde
  // TODO: background: Background,
  headshot: Headshot,
  icon: 'achievement_boss_zuldazar_blockade',
  fight: {
    // TODO: Add vantusRuneBuffId: 250144,
    softMitigationChecks: {
      physical: [],
      magical: [],
    },
  },
};
