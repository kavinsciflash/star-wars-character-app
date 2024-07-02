import CharacterList from "../components/CharacterList";
import { Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <Text fontWeight="bold" fontSize="26px" mb={2} mt={2} textAlign={"center"} fontFamily={"system-ui"}>Star Wars Character App</Text>
      <CharacterList />
    </div>
  );
}
