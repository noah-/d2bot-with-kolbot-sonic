/**
 *    @filename   Account.js
 *    @desc       generate data for accounts
 */

const Account = (function() {
  const PATH = 'libs/sonic/data/' + me.profile + '.json';

  return {
    /**
     * generate account datafile
     * @returns {*}
     */
    set: function() {
      let accountData;

      if (SETTINGS.hasOwnProperty(me.profile)) {
        accountData = SETTINGS[me.profile];
      } else {
        accountData = SETTINGS['all'];
        // generate random acct/char names
        accountData.account = Misc.randomString(15, true);
        accountData.charName = Misc.randomString(15, false);
      }

      // we only support sorceress
      accountData.charClass = 'sorceress';
      accountData.difficulty = 'Normal';
      // log the start time - issues with time being logged to txt file correctly
      //accountData.startTime = "";

      return Misc.dataAction.create(PATH, accountData);
    },
    /**
     * get the account information
     */
    get: function() {
      return Misc.dataAction.read(PATH);
    },
    /**
     * update a stat in our data file
     * @param prop - to be updated
     * @param value - to update to
     * @returns {*}
     */
    update: function(prop, value) {
      return Misc.dataAction.update(PATH, prop, value);
    },
  };
})();
