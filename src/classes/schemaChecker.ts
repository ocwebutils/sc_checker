import Ajv, { Options, ValidateFunction } from "ajv";

export class SchemaChecker {
	private ajvConfig: Options;
	private ajv: Ajv;
	private validator: ValidateFunction;

	constructor(schema: any) {
		this.ajvConfig = {
			allErrors: true,
			strict: false
		};
		this.ajv = new Ajv(this.ajvConfig);
		this.validator = this.ajv.compile(schema);
	}

	/**
	 * Validate config against schema
	 * @param {any} config - Provided config
	 */
	public validate(config: { [s: string]: unknown } | ArrayLike<unknown>) {
		const receivedResult = this.validator(config),
			errorArray: {
				path: string;
				expectedValue: string;
				type: string;
				ruleSet: { type: string; message: string };
			}[] = [],
			missingRoot: string[] = [];

		if (!receivedResult && this.validator.errors) {
			for (const error of this.validator.errors) {
				if (error.instancePath) {
					const returnObject = {
						type: "error",
						message: error.message as string
					};

					errorArray.push({
						path: error.instancePath.slice(1),
						expectedValue:
							error.params.missingProperty ??
							error.params.additionalProperty ??
							error.instancePath.split("/")[error.instancePath.split("/").length - 1],
						type: error.params?.type,
						ruleSet: returnObject
					});
				} else missingRoot.push(error.params.missingProperty);
			}
		}

		return { errorArray, missingRoot };
	}
}
