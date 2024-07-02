import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Image,
  Text,
  Spinner,
  Flex,
  Heading,
  Tag,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const CharacterDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
          const characterData = response.data;

          const filmPromises = characterData.films.map((filmUrl) => axios.get(filmUrl));
          const filmsResponse = await Promise.all(filmPromises);
          const filmTitles = filmsResponse.map((film) => film.data.title);

          setCharacter(characterData);
          setFilms(filmTitles);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching character data:", error);
          setLoading(false);
        }
      };

      fetchCharacter();
    }
  }, [id]);

  const goBackToList = () => {
    // Check if there's a query parameter 'source' and redirect accordingly
    if (router.query.source && router.query.source.toString() === "favorites") {
      router.push('/favorites');
    } else {
      router.push('/'); // Fallback to root page if source is not favorites or source is undefined
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Flex direction={{ base: "column", md: "row" }} align="center" boxShadow="md" p={6} rounded="md" backgroundColor={"whitesmoke"}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={goBackToList}
          aria-label="Go Back"
          variant="ghost"
          colorScheme="teal"
          mb={{ base: 4, md: 0 }}
          mr={{ md: 6 }}
        />

        <Image
          src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
          alt={character.name}
          objectFit="cover"
          w={{ base: "100%", md: "300px" }}
          h={{ base: "300px", md: "auto" }}
          borderRadius="md"
          boxShadow="lg"
        />

        <Box flex={1} ml={{ md: 6 }} backgroundColor={"whitesmoke"}>
          <Heading as="h2" size="xl" mb={4} fontFamily="body">{character.name}</Heading>

          <Stack spacing={3} mb={4}>
            <Text fontSize="lg"><strong>Height:</strong> {character.height} cm</Text>
            <Text fontSize="lg"><strong>Mass:</strong> {character.mass} kg</Text>
            <Text fontSize="lg"><strong>Hair Color:</strong> {character.hair_color}</Text>
            <Text fontSize="lg"><strong>Skin Color:</strong> {character.skin_color}</Text>
            <Text fontSize="lg"><strong>Eye Color:</strong> {character.eye_color}</Text>
            <Text fontSize="lg"><strong>Birth Year:</strong> {character.birth_year}</Text>
            <Text fontSize="lg"><strong>Gender:</strong> {character.gender}</Text>
          </Stack>

          <Box>
            <Heading as="h3" size="md" mb={2} fontFamily="body">Movies</Heading>
            <Stack spacing={2}>
              {films.map((film, index) => (
                <Tag key={index} colorScheme="teal">{film}</Tag>
              ))}
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CharacterDetail;
