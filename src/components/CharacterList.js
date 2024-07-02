import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Image, Text, SimpleGrid, IconButton, Flex, useToast, Spinner } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Link from 'next/link';

const CharacterList = () => {
    // State variables
    const [characters, setCharacters] = useState([]); // Holds the list of characters
    const [page, setPage] = useState(1); // Current page of characters
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [favorites, setFavorites] = useState([]); // List of favorite characters
    const [isAnimating, setIsAnimating] = useState(false); // State for animation
    const [isLoading, setIsLoading] = useState(true); // State for loading indicator

    // Chakra UI toast hook
    const toast = useToast();

    // Effect to fetch characters when page changes
    useEffect(() => {
        const fetchCharacters = async () => {
            setIsLoading(true); // Start loading indicator
            try {
                // Fetch characters from SWAPI
                const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
                setCharacters(response.data.results); // Update characters state
                setTotalPages(Math.ceil(response.data.count / 10)); // Calculate total pages
            } catch (error) {
                console.error("Error fetching characters:", error);
            } finally {
                setIsLoading(false); // Turn off loading indicator
            }
        };

        fetchCharacters(); // Call fetchCharacters when page changes
    }, [page]); // Depend on page state

    // Effect to load favorites from localStorage on component mount
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')); // Retrieve favorites from localStorage
        if (storedFavorites) {
            setFavorites(storedFavorites); // Set favorites state if found in localStorage
        }
    }, []); // Run once on component mount

    // Toggle favorite status of a character
    const toggleFavorite = (character) => {
        const isFavorite = favorites.some((fav) => fav.name === character.name); // Check if character is already a favorite
        if (isFavorite) {
            setFavorites(favorites.filter((fav) => fav.name !== character.name)); // Remove from favorites
            showToast(`${character.name} removed from favorites.`);
        } else {
            setFavorites([...favorites, character]); // Add to favorites
            showToast(`${character.name} added to favorites!`);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage with new favorites
        setIsAnimating(true); // Trigger animation
        setTimeout(() => setIsAnimating(false), 1000); // Turn off animation after 1 second
    };

    // Show toast message
    const showToast = (message) => {
        toast({
            title: message,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    // Change page handler
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber); // Update page state
    };

    // Go to previous page
    const goToPreviousPage = () => {
        setPage((prevPage) => prevPage - 1); // Decrease page by 1
    };

    // Go to next page
    const goToNextPage = () => {
        setPage((prevPage) => prevPage + 1); // Increase page by 1
    };

    // Render page number buttons
    const renderPageButtons = () => {
        const buttons = [];
        const maxButtonsToShow = 3; // Maximum number of page buttons to show

        let start = Math.max(1, page - Math.floor(maxButtonsToShow / 2));
        let end = Math.min(totalPages, start + maxButtonsToShow - 1);

        if (end - start < maxButtonsToShow - 1) {
            start = Math.max(1, end - maxButtonsToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            buttons.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    mx={1}
                    colorScheme={page === i ? "teal" : "gray"}
                >
                    {i}
                </Button>
            );
        }

        return buttons; // Return the rendered page buttons
    };

    // Render loading spinner if data is loading
    if (isLoading) {
        return (
            <Flex height="100vh" justifyContent="center" alignItems="center">
                <Box>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading...</Text>
                </Box>
            </Flex>
        );
    }

    // Render character list and pagination
    return (
        <Box p={4}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                {characters.map((character) => (
                    <Link href={`/character/${character.url.match(/\/(\d+)\//)[1]}`} key={character.name}>
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
                            <Box p={4} style={{ border: "1px solid #d3d3d3", borderTop: "none",  backgroundColor:"whitesmoke" }}>
                                <Text fontWeight="bold" fontSize="xl" mb={2}>{character.name}</Text>
                                <Flex justify="space-between" alignItems="center">
                                    <Text fontSize="sm">Height: {character.height}cm</Text>
                                    <IconButton
                                        icon={<StarIcon color={favorites.some((fav) => fav.name === character.name) ? "yellow.400" : "gray.400"} />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleFavorite(character);
                                        }}
                                        aria-label="Toggle Favorite"
                                        _hover={{
                                            transform: isAnimating ? "scale(1.2)" : "none",
                                            transition: "transform 0.2s ease-in-out"
                                        }}
                                        style={{ background : "green"}}
                                    />
                                </Flex>
                                <Button
                                    variant="outline"
                                    colorScheme="teal"
                                    size="sm"
                                    mt={2}
                                    href={`/character/${character.url.match(/\/(\d+)\//)[1]}`}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>
            <Flex mt="4" justifyContent="center" alignItems="center">
                {page > 1 && (
                    <Button
                        onClick={goToPreviousPage}
                        mx={1}
                        colorScheme="teal"
                    >
                        Previous
                    </Button>
                )}
                {renderPageButtons()}
                {page < totalPages && (
                    <Button
                        onClick={goToNextPage}
                        mx={1}
                        colorScheme="teal"
                    >
                        Next
                    </Button>
                )}
            </Flex>
        </Box>
    );
};

export default CharacterList;
