class Member {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.image = data.image;
        this.title = data.title;
        this.bio = data.bio;
        this.about = data.about;
    }
}

class Box {
    constructor(data) {
        this.id = data.id;
        this.icon = data.icon;
        this.subtitle = data.subtitle;
        this.text = data.text;
    }
}

function parseData(data, name) {
    const parsed = JSON.parse(data)[name];

    const arr = [];
    const Obj = (name == 'functionality') ? Box : Member;

    parsed.map((info, i) => {
        arr[i] = new Obj(info);
    });
    
    return arr;
}

module.exports = {
    parseData: parseData,
};
