import { v4 } from "uuid";

function check(reason: string, check: () => unknown): void {
    check();
}

function affirm(value: unknown) {
    return {
        toBe(expected: unknown) {
            if (value !== expected) {
                throw new Error(`Expected ${value} to be ${expected}`);
            }
        },
        toHave(key: string) {
            // @ts-ignore
            if (!(key in value)) {
                throw new Error(`Expected ${JSON.stringify(value)} to have ${key}`);
            }
        },
    };
}

async function testFetch(input: RequestInfo | URL, body: object, init?: RequestInit | undefined) {
    const res = await fetch(`http://localhost:3001${input}`, {
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        ...init,
    });
    return await res.json();
}

check("sign up detects bot", async () => {
    affirm(
        await testFetch(
            "/users/sign-up",
            {
                email: "a",
                password: "a",
                username: "a",
                reCAPTCHAToken:
                    "03ANYolqvBVpAnaWrI1mXFBXtR2cxQXTR9srPhv4ZB6oCVXt7121OL0liBeedPt06CFq9CPAJ6oikPCrwOvKuMgqw5Jr29MhD9XdHDfiz4xtRNbLwputeqW2jARZpSRBJnLrCYIeQ3Rzk11ZUbInyv_NS-HE_Y_XJtZcWwFICfZU01dFrcHm8tpeA_OqF6v9HrVRyhjAoe2HHn0r8EenyHYWwkOyVINx7xjLT8BnSVUVXvN9g1H2ljIZjLMs-xgD4pRGq6lnyl_Tr88aCH7NKPUiDl7dfc3LSD5ZMxZp-cxy410-g2Q_QipAyPG-LizRksmMbRxbAYinQhAxpFNF-6THRSmKJWTjbLLwMtNF6-K5aI92_GJC957v1ZdwedpxR9NOZlU4-dRN0LbLSCcA8AANBdSCaUvpEcURzVZQf6nH5_dDJqYZg6GU6SqJ-zc3ERmuTdEk2Wj2X1G261nXA8DEDObdo7jrPAVJfPIs_yAHf1uK2IAFGNJU2e3bIKB1a_jXk4yiAQbH2f",
            },
            {
                method: "POST",
            }
        )
    ).toHave("clientIsRobot");
});

check("login return no user with username", async () => {
    affirm(
        await testFetch(
            "/users/log-in",
            {
                username: v4(),
                password: "a",
            },
            {
                method: "POST",
            }
        )
    ).toHave("userNotFound");
});

check("login return wrong password", async () => {
    affirm(
        await testFetch(
            "/users/log-in",
            {
                username: "a",
                password: v4(),
            },
            {
                method: "POST",
            }
        )
    ).toHave("wrongPassword");
});
