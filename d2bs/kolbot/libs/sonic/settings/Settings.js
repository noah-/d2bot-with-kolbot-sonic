/**
 *	@filename	Settings.js
 *	@desc		config for sonic profiles
 */

const SETTINGS = {
	
	/**
	 * all profiles will use this setting
	 * by default unless they have their
	 * own settings below.
	 * account and charname automatically generated
	 */
	 
	"all": {
		password: "jess",
		realm: "useast",
		ladder: true, 
		expansion: true,
		hardcore: false,
		respecLevel: 24,
		beforeRespecBuild: "start",
		afterRespecbuild: "xblizzard"
	},
	
	//////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	/**
	 * individual profile settings
	 */
	//////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	
	"runner": {
		account: "",
		password: "",
		charName: "",
		realm: "useast",
		ladder: true,
		expansion: true,
		hardcore: false,
		respecLevel: 24,
		beforeRespecBuild: "start",
		afterRespecbuild: "xblizzard"
	}
};
