export type UnaryFunction = (a: any) => any;
export type VariadicFunction = (...a: any[]) => any;

export type UnaryFunctionParameter<F extends UnaryFunction> = Parameters<F>[0];

export type FirstElementInArrayType<T extends Array<any>> =
    T extends [infer TT, ...any[]]
    ? TT
    : any;

export type LastElementInArrayType<T extends Array<any>> =
    T extends [...any[], infer TT]
    ? TT
    : any;
