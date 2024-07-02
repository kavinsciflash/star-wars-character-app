import { useEffect, useState } from "react";
import { Box, SimpleGrid, Image, Text, IconButton, Flex, Button } from "@chakra-ui/react";
import { ArrowBackIcon, StarIcon } from "@chakra-ui/icons";
import Link from 'next/link';
import { useRouter } from 'next/router';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [source, setSource] = useState(""); // State to track source page
    const router = useRouter();

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);

        // Check if there's a query parameter indicating source page
        if (router.query.source) {
            setSource(router.query.source.toString());
        }
    }, []);

    const removeFavorite = (character) => {
        const updatedFavorites = favorites.filter((fav) => fav.name !== character.name);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <Box p={4} mt={6} mb={6}>
            <Button
                leftIcon={<ArrowBackIcon />}
                colorScheme="teal"
                variant="outline"
                mb={4}
                onClick={() => router.replace('/')}
            >
                Go Back
            </Button>

            {favorites.length === 0 ? (
                <Text fontSize="xl" fontWeight="bold" textAlign="center" mt={8}>
                    No items available
                </Text>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                    {favorites.map((character) => (
                        <Link href={`/character/${character.url.match(/\/(\d+)\//)[1]}?source=favorites`} key={character.name}>
                            <Box
                                as="a"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                cursor="pointer"
                                boxShadow="md"
                                transition="transform 0.2s"
                                border={"none"}
                                _hover={{ transform: "scale(1.05)" }}
                                fontFamily="Roboto, sans-serif"
                                position="relative"
                                backgroundColor={"white"}
                                // p={4}
                                m={2}
                            >
                                <Image
                                    src={`https://starwars-visualguide.com/assets/img/characters/${character.url.match(/\/(\d+)\//)[1]}.jpg`}
                                    alt={character.name}
                                    objectFit="cover"
                                    w="100%"
                                    h="200px"
                                    borderTopRadius="lg"
                                    className="character-image"
                                />
                                <Box p={4} style={{ border: "1px solid #d3d3d3", borderTop: "none", backgroundColor: "whitesmoke" }}>
                                    <Text fontWeight="bold" fontSize="xl" mb={2}>{character.name}</Text>
                                    <Flex justify="space-between" alignItems="center">
                                        <Text fontSize="sm">Height: {character.height}cm</Text>
                                        <IconButton
                                            icon={<StarIcon color="yellow.400" />}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFavorite(character);
                                            }}
                                            aria-label="Remove from Favorites"
                                            style={{ background: "green" }}
                                        />
                                    </Flex>
                                    <Button
                                        variant="outline"
                                        colorScheme="teal"
                                        size="sm"
                                        mt={2}
                                        href={`/character/${character.url.match(/\/(\d+)\//)[1]}?source=favorites`}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default Favorites;
