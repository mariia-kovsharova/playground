// РАССМАТРИВАЕМ ТЕМЫ: получение типов из типов, сложные типы, infer

// keyof - получение всех ключей переданного объекта

type Point = { x: number; y: number };
type P = keyof Point; // "x" | "y"

type Obj = { [key: string]: number };
type O = keyof Obj; // string | number  <=== потому что ключом может быть и строка, и число

// Получение типа конкретного поля из условного типа
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>; // string
type DogMessageContents = MessageOf<Dog>; // never

// in - оператор перечисления, в данном примере берутся все ключи типа Type и смотрится, соответствует ли поле в типе интерфейсу { pii: true }
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type DBFields2 = {
  id: { format: "incrementing" };
  name: { type: string; pii: false };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
type ObjectsNeedingGDPRDeletion2 = ExtractPII<DBFields2>;


type TransformValueType<T> = T extends string ? string : T;
// overload
function transformDefaultValue<T>(value: T): TransformValueType<T>;
function transformDefaultValue<T>(value: T): string | T {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return value;
}

const fourtyTwo = 42; // тип - 42, "узкий" наследник типа number
let fifteen = 15; // number, т.к. значение переменной может меняться

const typeShouldBeString = transformDefaultValue('text'); // тип - string
const typeShouldBeNumber = transformDefaultValue(fifteen); // тип - number
const typeShouldBe42 = transformDefaultValue(fourtyTwo); // тип - 42


// Интерфейс с перечнем каких-то возможных действий
interface IActions {
  create: boolean;
  copy: boolean;
  delete: boolean;
  doSomethingElse: boolean;
}

// Интерфейс объекта, куда входят эти действия
interface IDocument {
  id?: string;
  actions?: IActions;
}

// Константа с действиями, которые доступны для конкретного документа
const actionsForDocumentA: Partial<IActions> = {
  create: true,
  delete: true,
};

// Условный тип, который получает все ключи переданного в T типа через запись с помощью infer
type ActionNames<T> = T extends infer R ? keyof R : never;
// аналогично - type ActionNames<T> = keyof T;

// Получаем все имена возможных действий, Union Type
type PossibleActionNames = ActionNames<IActions>; // "create" | "copy" | "delete" | "doSomethingElse"

// Тип функции, которая проверяет значение конкретного типа в конкретном документе
// type ActionPredicate = <T extends IDocument, P extends ActionNames<IActions>>(document: T, action: P) => boolean;

// Функция-предикат для получения значения конкретного действия в конкретном документе
const predicate = <T extends IDocument>(document: T, action: ActionNames<IActions>): boolean => {
  return !!document.actions && document.actions[action];
}

// Функция, которая проверяет по всем документам все права и на основе их строит общие права
const extractCommonActionValue = (documents: IDocument[], action: PossibleActionNames, fn: typeof predicate): boolean => {
  return !!documents.length && documents.every((row) => fn(row, action));
}

const getPossibleActionsForAllDocuments = (): void => {
  const documents: IDocument[] = [
    {
      id: 'one',
      actions: {
        create: true,
        copy: true,
        delete: true,
        doSomethingElse: true,
      },
    },
    {
      id: 'two',
      actions: {
        create: true,
        copy: false,
        delete: false,
        doSomethingElse: true,
      },
    },
    {
      id: 'three',
      actions: {
        create: true,
        copy: false,
        delete: true,
        doSomethingElse: true,
      },
    },
  ];

  const keys = Object.keys(actionsForDocumentA) as PossibleActionNames[];

  const actionsForAllDocuments = keys.reduce((acc: Partial<IActions>, action: PossibleActionNames) => {
    const value = extractCommonActionValue(documents, action, predicate);
    return ({ ...acc, [action]: value });
  }, {});

  console.log(actionsForAllDocuments);
  /**
  
  Общие для всех документов действия

  {
    "create": true,
    "delete": false
  } 

   */
}

getPossibleActionsForAllDocuments();

export { }
