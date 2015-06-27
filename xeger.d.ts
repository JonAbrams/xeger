/**
 * Make Xeger interfaces available to scripts, and avoid polluting the global namespace.
 */
declare module xeger
{
	/**
	 * You can pass in a few options to the above rule functions.
	 */
	export interface ConstructorOptions
	{
		/**
		 * Will attempt to match the regex multiple times.
		 */
		global?      : boolean;
		/**
		 * Will attempt to match the regex multiple times.
		 */
		multiline?   : boolean;
		/**
		 * Case insensitive matching.
		 */
		insensitive? : boolean;
	}

	export interface RuleOptions
	{
		/**
		 * Will try to continuously apply the rule.
		 */
		multiple? : boolean;
		/**
		 * Will try to match but will skip over if it cannot match.
		 */
		optional? : boolean;
		/**
		 * Applies the specified rule the specified number of times.
		 */
		repeat?   : number;
		/**
		 * Similar to repeat, but specifies the minimum.
		 */
		from?     : number;
		/**
		 * Similar to from, but specifies the maximum.Often used with from.
		 */
		to?       : number;
	}

	export interface GroupOptions extends RuleOptions
	{
		/**
		 * Use the ignore option to create a non-capture group.
		 */
		ignore?: boolean;
	}
}

interface xeger
{
	/**
	 * Matches the exact string passed in. x.literal will escape any non-alpha numeric character.
	 */
	literal(): xeger;
	literal(string: string): xeger;
	literal(string: string, options: xeger.RuleOptions): xeger;

	/**
	 * Without a parameter, will match any single character.
	 * If you pass in a string, it's match any of the characters in the string.
	 */
	any(): xeger;
	any(string: string): xeger;
	any(callback: () => void): xeger;
	any(string: string, options: xeger.RuleOptions): xeger;
	any(callback: () => void, options: xeger.RuleOptions): xeger;

    /**
	 * The inverse of any.
	 * Creates a set of characters to not match against.
	 * Without a parameter, will not match any single character.
	 * If you pass in a string, it will not match any of the characters in the string.
	 */
	not(): xeger;
	not(string: string): xeger;
	not(callback: () => void): xeger;
	not(string: string, options: xeger.RuleOptions): xeger;
	not(callback: () => void, options: xeger.RuleOptions): xeger;

	/**
	 * Used to create the '-' inside any and not functions (see examples for any and not).
	 */
	to(): xeger;

	/**
	 * Matches any single alpha- numeric character (includes letters, numbers, and the underscore).
	 */
	alphanumeric(): xeger;
	alphanumeric(options: xeger.RuleOptions): xeger;

	/**
	 * Matches a single number character.
	 */
	number(): xeger;
	number(options: xeger.RuleOptions): xeger;

	/**
	 * Matches a white-space character (e.g.tab, newline, and space)
	 */
	whitespace(): xeger;
	whitespace(options:xeger. RuleOptions): xeger;

	/**
	 * Matches a newline character
	 */
	newline(): xeger;
	newline(options: xeger.RuleOptions): xeger;

	/**
	 * Matches the start of the string.
	 */
	start(): xeger;

	/**
	 * Matches the end of the string.
	 */
	end(): xeger;

	/**
	 * Creates a capture group for all the rules declared within the passed in callback function.
	 */
	group(): xeger;
	group(callback: () => void): xeger;
	group(callback: () => void, options: xeger.RuleOptions): xeger;

	regex(): RegExp;
}

/**
 * Call this to start the construction of the regex, passing in a callback function. It returns a RegExp object.
 */
declare function xeger(): RegExp;

/**
 * Use the rest of the functions in this section (the rule functions) to construct a regex by calling them within the callback.
 * The callback function will be called with one parameter, the xeger object.
 * The rest of the functions here should be called on the xeger object.
 * The callback is also called with the xeger object assigned to this.
 */
declare function xeger(callback: (object: xeger) => void): RegExp;

/**
 * The options object passed here is different from the options object used in the rest of the API.This one takes the following keys:
 */
declare function xeger(callback: (Object: xeger) => void, options: xeger.ConstructorOptions): RegExp;

/**
 * Export for AMD loaders
 */
declare module 'xeger'
{
	export = xeger;
}