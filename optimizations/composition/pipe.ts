import {
    FirstElementInArrayType, LastElementInArrayType,
    UnaryFunction, UnaryFunctionParameter
} from '../types';

type FirstFunctionParamType<Fn extends Array<UnaryFunction>> =
    UnaryFunctionParameter<FirstElementInArrayType<Fn>>;

type LastFunctionReturnType<Fn extends Array<UnaryFunction>> =
    ReturnType<LastElementInArrayType<Fn>>;

type Pipeline<
    // Pipeline has to contain at least one unary function
    StepFunctions extends [UnaryFunction, ...Array<UnaryFunction>],
    Length extends number = StepFunctions['length']
> =
    // Remember, here we can consider "A extends B" as A IS EQUAL B

    // Is the current function single?
    Length extends 1
    // If it is the (last) single function, just return it as process
    ? StepFunctions
    // OR we need to infer the return type of the current (first) function
    // and check that the next (second) function gets as input an argument of the appropriate type
    : StepFunctions extends [infer Current, infer Next, ...infer RestSteps]
    ? [
        Current,
        // Here we spread the types of the next functions, but before we need to check inputs-outputs
        ...Pipeline<
            // If the current step is the unary function
            Current extends UnaryFunction
            // And the next step is the unary function
            ? Next extends UnaryFunction
            // And the rest steps are an array of unary functions
            ? RestSteps extends Array<UnaryFunction>
            // The next "current" (first) function gets as input an argument
            // with type the "real current return"
            ? [(param: ReturnType<Current>) => ReturnType<Next>, ...RestSteps]
            : never
            : never
            : never
        >
    ]
    : StepFunctions
    ;

const pipe =
    <PipelineFunctions extends [UnaryFunction, ...Array<UnaryFunction>]>
        (...functions: Pipeline<PipelineFunctions>) =>
        (input: FirstFunctionParamType<PipelineFunctions>): LastFunctionReturnType<PipelineFunctions> => {
            const len = functions.length;
            let result = functions[0](input);

            for (let i = 1; i < len; i += 1) {
                result = functions[i](result);
            }

            return result;

            /** OR we can use reduce, the loop is only for simplicity of understanding */
        };

export { pipe };

