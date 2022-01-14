Neutralino.events.on('trayMenuItemClicked', (item) => {
    for (const tray of Tray.trays)
        for (const trayItem of tray.items)
            if (trayItem.id === item.detail.id) {
                if (trayItem.click) {
                    trayItem.click({
                        id: item.detail.id,
                        text: item.detail.text,
                        disabled: item.detail['isDisabled'],
                        checked: item.detail['isChecked'],
                        click: trayItem.click
                    });
                }
                return;
            }
});
export default class Tray {
    constructor(icon, items = []) {
        this._items = [];
        this.icon = icon;
        this.items = items;
        Tray.trays.push(this);
    }
    get items() {
        return this._items.map((item) => {
            return {
                id: item.id,
                text: item.text,
                disabled: item['isDisabled'],
                checked: item['isChecked'],
                click: item.click
            };
        });
    }
    set items(items) {
        this._items = items.map((item) => {
            if (item.id === undefined && item.click !== undefined)
                item.id = 'click:' + Math.random().toString().substring(2);
            return {
                id: item.id,
                text: item.text,
                isDisabled: item.disabled,
                isChecked: item.checked,
                click: item.click
            };
        });
    }
    update(items = null) {
        if (items !== null)
            this.items = items;
        return Neutralino.os.setTray({
            icon: this.icon,
            menuItems: this._items
        });
    }
    hide() {
        return Neutralino.os.setTray({
            icon: this.icon,
            menuItems: []
        });
    }
}
Tray.trays = [];
;
