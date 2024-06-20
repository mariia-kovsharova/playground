class TodoItem {
    private _id: string;

    public name: string;
    public description: string;
    public isCompleted: boolean;

    constructor({ id, name, description }: { id: string; name: string; description: string }) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.isCompleted = false;
    }

    get id(): string {
        return this._id;
    }

    toggle(): void {
        this.isCompleted = !this.isCompleted;
    }
}
