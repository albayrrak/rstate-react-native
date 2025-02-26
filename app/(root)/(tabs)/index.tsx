import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text className="text-red-950 font-bold text-4xl">Test</Text>
            <Link href={"/sign-in"}>
                SignIn
            </Link>
        </View>
    );
}
