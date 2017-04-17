interface ConstructorOptions
{
	global?: boolean;
	multiline?: boolean;
	insensitive?: boolean;
}

interface RuleOptions
{
	multiple?: boolean;
	optional?: boolean;
	repeat?: number;
	from?: number;
	to?: number;
}

interface GroupOptions extends RuleOptions
{
	ignore?: boolean;
}

class Xeger
{
	public regexStr = '';
	public flags = '';

	constructor(cb: (xeger: Xeger) => void, options?: ConstructorOptions)
	{
		options = options || {};

		if (options.multiline)
		{
			this.flags += 'm';
		}
		if (options.global)
		{
			this.flags += 'g';
		}
		if (options.insensitive)
		{
			this.flags += 'i';
		}
		if (typeof cb === 'function')
		{
			cb.call(this, this);
		}
	}

	private add(str: string)
	{
		this.regexStr += str;
	}

	private addOptions(options: RuleOptions)
	{
		options = options || {};

		if (options.multiple && options.optional)
		{
			this.add('*');
		}
		else if (options.multiple)
		{
			this.add('+');
		}
		else if (options.optional)
		{
			this.add('?');
		}
		else if (typeof options.repeat === 'number')
		{
			this.add('{' + options.repeat + '}');
		}
		else if (typeof options.from === 'number' || typeof options.to === 'number')
		{
			this.add('{');
			if (typeof options.from === 'number')
			{
				this.add(options.from.toString());
			}
			this.add(',');
			if (typeof options.to === 'number')
			{
				this.add(options.to.toString());
			}
			this.add('}');
		}
	}

	private escape(str: string)
	{
		return str.split('').map(function (char)
		{
			if (/\w/.test(char))
			{
				return char;
			}
			else
			{
				return '\\' + char;
			}
		}).join('');
	}


	public literal(str: string, options: {})
	{
		var hasOptions = typeof options === 'object' &&
			Object.keys(options).length > 0 &&
			str.length > 1;
		if (hasOptions)
		{
			this.add('(?:');
		}

		this.add(this.escape(str));

		if (hasOptions)
		{
			this.add(')');
		}
		this.addOptions(options);

		return this;
	}

	public alphanumeric(options: RuleOptions)
	{
		this.add('\\w');
		this.addOptions(options);

		return this;
	}


	public number(options: RuleOptions)
	{
		this.add('\\d');
		this.addOptions(options);

		return this;
	}


	newline(options: RuleOptions)
	{
		this.add('\\n');
		this.addOptions(options);

		return this;
	}

	whitespace(options: RuleOptions)
	{
		this.add('\\s');
		this.addOptions(options);

		return this;
	}

	start()
	{
		this.add('^');

		return this;
	}

	end()
	{
		this.add('$');

		return this;
	}

	to()
	{
		this.add('-');

		return this;
	}

	any(str: string|Function, options?: RuleOptions)
	{
		if (typeof str === 'string')
		{
			this.add('[' + this.escape(str) + ']');
		}
		else if (typeof str === 'function')
		{
			var cb = str;
			this.add('[');
			cb.call(this, this);
			this.add(']');
		}
		else
		{
			options = str;
			this.add('.');
		}
		this.addOptions(options);

		return this;
	}

	not(str?: string|Function, options?: RuleOptions)
	{
		if (typeof str === 'string')
		{
			this.add('[^' + this.escape(str) + ']');
		}
		else if (typeof str === 'function')
		{
			var cb = str;
			this.add('[^');
			cb.call(this, this);
			this.add(']');
		}
		this.addOptions(options);
	}

	group(cb: Function, options?: GroupOptions)
	{
		this.add('(');
		if (options && options.ignore)
		{
			this.add('?:');
		}
		cb.call(this, this);
		this.add(')');
		this.addOptions(options);

		return this;
	}

	regex()
	{
		return new RegExp(this.regexStr, this.flags);
	}
}

export = (cb: (xeger: Xeger) => void, options: ConstructorOptions): Xeger|RegExp =>
{
	if (typeof cb !== 'function')
	{
		options = cb;
	}
	var r = new Xeger(cb, options);

	if (typeof cb === 'function')
	{
		return r.regex();
	}
	else
	{
		return r;
	}
};