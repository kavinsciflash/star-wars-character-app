import styles from "../styles/Home.module.css";
import CharacterList from "../components/CharacterList";
import { Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.main}>
      <Text fontWeight="bold" fontSize="26px" mb={2} mt={2}>Star Wars Character App</Text>
      <CharacterList />
    </div>
  );
}
