
// Import necessary modules from React, Next.js, Chakra UI, and Axios
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

// Define the CharacterDetail component
const CharacterDetail = () => {
  const router = useRouter(); // Next.js router instance
  const { id } = router.query; // Extracting the 'id' parameter from the router query
  const [character, setCharacter] = useState(null); // State for storing character data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [films, setFilms] = useState([]); // State for storing films related to the character

  // useEffect hook to fetch character data and films when 'id' changes
  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          // Fetch character data from SWAPI (Star Wars API)
          const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
          const characterData = response.data;

          // Fetch details of films in which the character appears
          const filmPromises = characterData.films.map((filmUrl) => axios.get(filmUrl));
          const filmsResponse = await Promise.all(filmPromises);
          const filmTitles = filmsResponse.map((film) => film.data.title);

          // Update states with fetched data
          setCharacter(characterData); // Set character details
          setFilms(filmTitles); // Set films related to the character
          setLoading(false); // Set loading state to false
        } catch (error) {
          console.error("Error fetching character data:", error); // Log any errors encountered
          setLoading(false); // Set loading state to false in case of error
        }
      };

      fetchCharacter(); // Invoke the fetchCharacter function
    }
  }, [id]); // useEffect will re-run whenever 'id' changes

  // Function to navigate back to the list view
  const goBackToList = () => {
    router.push('/'); // Navigate to the root page
  };

  // Render loading spinner if data is still loading
  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Render character details once data has loaded
  return (
    <Box p={4}>
      <Flex direction={{ base: "column", md: "row" }} align="center" boxShadow="md" p={6} rounded="md" backgroundColor={"whitesmoke"}>
        {/* Back button to return to the list view */}
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={goBackToList}
          aria-label="Go Back"
          variant="ghost"
          colorScheme="teal"
          mb={{ base: 4, md: 0 }}
          mr={{ md: 6 }}
        />

        {/* Character image */}
        <Image
          src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
          alt={character.name}
          objectFit="cover"
          w={{ base: "100%", md: "300px" }}
          h={{ base: "300px", md: "auto" }}
          borderRadius="md"
          boxShadow="lg"
        />

        {/* Container for character details */}
        <Box flex={1} ml={{ md: 6 }} backgroundColor={"whitesmoke"}>
          <Heading as="h2" size="xl" mb={4} fontFamily="body">{character.name}</Heading>

          {/* Stack for displaying various character attributes */}
          <Stack spacing={3} mb={4}>
            <Text fontSize="lg"><strong>Height:</strong> {character.height} cm</Text>
            <Text fontSize="lg"><strong>Mass:</strong> {character.mass} kg</Text>
            <Text fontSize="lg"><strong>Hair Color:</strong> {character.hair_color}</Text>
            <Text fontSize="lg"><strong>Skin Color:</strong> {character.skin_color}</Text>
            <Text fontSize="lg"><strong>Eye Color:</strong> {character.eye_color}</Text>
            <Text fontSize="lg"><strong>Birth Year:</strong> {character.birth_year}</Text>
            <Text fontSize="lg"><strong>Gender:</strong> {character.gender}</Text>
          </Stack>

          {/* Container for displaying films related to the character */}
          <Box>
            <Heading as="h3" size="md" mb={2} fontFamily="body">Movies</Heading>
            <Stack spacing={2}>
              {/* Display each film as a Tag */}
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

export default CharacterDetail; // Export the CharacterDetail component
