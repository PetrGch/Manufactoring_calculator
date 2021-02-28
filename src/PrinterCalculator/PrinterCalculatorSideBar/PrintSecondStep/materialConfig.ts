interface MaterialColors {
    code: string;
    name: string;
    disabled?: boolean;
}

interface MaterialConfig {
    id: string;
    name: string;
    cost: number;
    colors: MaterialColors[];
    disabled?: boolean
}

const materialConfig: MaterialConfig[] = [
    {
        id: "abs",
        name: "ABS plastic",
        cost: 90,
        colors: [
            {
                code: "#ffffff",
                name: "White"
            },
            {
                code: "#000000",
                name: "Black"
            },
            {
                code: "#726e6f",
                name: "Metallic"
            },
            {
                code: "#176299",
                name: "Blue",
                disabled: true,
            },
            {
                code: "#32973e",
                name: "Green"
            }
        ]
    },
    {
        id: "pla",
        name: "PLA plastic",
        cost: 120,
        colors: [
            {
                code: "#ffffff",
                name: "White"
            },
            {
                code: "#000000",
                name: "Black"
            },
            {
                code: "#726e6f",
                name: "Metallic"
            },
            {
                code: "#176299",
                name: "Blue",
                disabled: true,
            },
            {
                code: "#32973e",
                name: "Green",
                disabled: true
            }
        ]

    },
    {
        id: "tpu",
        name: "TPU",
        cost: 130,
        colors: [
            {
                code: "#ffffff",
                name: "White"
            },
            {
                code: "#000000",
                name: "Black"
            },
            {
                code: "#726e6f",
                name: "Metallic"
            },
            {
                code: "#176299",
                name: "Blue",
                disabled: true,
            },
            {
                code: "#32973e",
                name: "Green",
                disabled: true
            }
        ]

    },
    {
        id: "pet-g",
        name: "PET-G",
        cost: 85,
        colors: [
            {
                code: "#ffffff",
                name: "White"
            },
            {
                code: "#000000",
                name: "Black"
            },
            {
                code: "#726e6f",
                name: "Metallic",
                disabled: true,
            },
            {
                code: "#176299",
                name: "Blue",
            },
            {
                code: "#32973e",
                name: "Green",
            }
        ]

    }
]

export default materialConfig;