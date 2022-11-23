import {
    FirstElementInArrayType, LastElementInArrayType,
    UnaryFunction, UnaryFunctionParameter
} from '../types';

type LastFunctionParamType<Fn extends Array<UnaryFunction>> =
    UnaryFunctionParameter<LastElementInArrayType<Fn>>;

type FirstFunctionReturnType<Fn extends Array<UnaryFunction>> =
    ReturnType<FirstElementInArrayType<Fn>>;

type Compose<
    // Compose has to contain at least one unary function
    StepFunctions extends [...Array<UnaryFunction>, UnaryFunction],
    Length extends number = StepFunctions['length']
> =
    // Remember, here we can consider "A extends B" as A IS EQUAL B

    // Is the current function single?
    Length extends 1
    // If it is the (last) single function, just return it as process
    ? StepFunctions
    // OR we need to infer the return type of the inner (current) function
    // and check that its return is ok as the input for the outer (next) function
    : StepFunctions extends [...infer Rest, infer Outer, infer Inner]
    ? [
        ...Compose<
            // if inner is 
            Inner extends UnaryFunction
            ? Outer extends UnaryFunction
            ? Rest extends Array<UnaryFunction>
            ? [...Rest, (arg: ReturnType<Inner>) => ReturnType<Outer>]
            : never
            : never
            : never
        >,
        Inner
    ]
    : StepFunctions
    ;

const compose =
    <ComposeFunctions extends [...Array<UnaryFunction>, UnaryFunction]>
        (...functions: Compose<ComposeFunctions>) =>
        (input: LastFunctionParamType<ComposeFunctions>): FirstFunctionReturnType<ComposeFunctions> => {
            let len = functions.length - 1;
            let result = functions[len--](input);

            for (let i = len; i >= 0; i -= 1) {
                result = functions[i](result);
            }

            return result;

            /** OR we can use reduce, the loop is only for simplicity of understanding */
        };

export { compose };

