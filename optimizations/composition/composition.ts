type UnaryFunction = (a: any) => any;
type VariadicFunction = (...a: any[]) => any;

// infers the type of the last element
type LastType<T extends any[]> = T extends [...infer _, infer LastElementType]
    ? LastElementType
    : never;

// infers the type of the first element 
type FirstType<T extends any[]> = T extends [infer FirstElementType, ...infer _]
    ? FirstElementType
    : never;

// TODO: try to check types
type Compose = any;

type Pipe = any;

export const compose = (...functions: Array<UnaryFunction>) => <T>(initialValue: T) => {
    return functions.reduceRight(
        (currentValue, currentStepFunction) =>
            currentStepFunction(currentValue),
        initialValue
    );
};

export const pipe = (...functions: Array<UnaryFunction>) => <T>(initialValue: T) => {
    return functions.reduce(
        (currentValue, currentFunction) =>
            currentFunction(currentValue),
        initialValue
    );
};