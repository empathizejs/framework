declare type Item = {
    /**
     * Item text
     */
    text: string;
    /**
     * Item id
     */
    id?: string;
    /**
     * Whether the item disabled or not
     *
     * If yes, then it will be a string
     */
    disabled?: boolean;
    /**
     * Is this item a checkbox or not
     */
    checked?: boolean;
    /**
     * Event on click
     *
     * If specified, then will generate random
     * item id if it is not specified
     */
    click?: (item: Item) => void;
};
export default class Tray {
    static trays: Tray[];
    icon: string;
    protected _items: Item[];
    get items(): Item[];
    set items(items: Item[]);
    constructor(icon: string, items?: Item[]);
    update(items?: Item[] | null): Promise<void>;
    hide(): Promise<void>;
}
export type { Item };
