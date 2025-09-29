import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { images } from '@/constants/images';
import MovieCard from '@/components/MovieCard';
import { useFetch } from '@/services/service_hooks/useFetch';
import { fetchMovies } from '@/services/api';
import { icons } from '@/constants/icons';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset: resetMovies,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery,
      }),
    false,
  );

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        resetMovies();
      }
      return () => clearTimeout(timeOutId);
    }, 500);
  }, [searchQuery, loadMovies, resetMovies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search your movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                {moviesError.message}
              </Text>
            )}
            {!moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "Oops we're so sorry! No movies found. Please try another search query"
                  : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};
export default Search;
