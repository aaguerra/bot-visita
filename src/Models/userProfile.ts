export class UserProfile {
    public name: string;
    public age: number;
    public companiesToReview: any;
    constructor(name, age) {
        this.name = name;
        this.age = age;

        // The list of companies the user wants to review.
        this.companiesToReview = [];
    }
}
