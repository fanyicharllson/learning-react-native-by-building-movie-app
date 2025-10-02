import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import TrendingCard from '@/components/TrendingCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { getTrendingMovie } from '@/services/appwrite_service/appwrite';
import { useFetch } from '@/services/service_hooks/useFetch';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, View, Text, FlatList } from 'react-native';

export default function Index() {
  const router = useRouter();

  //load trending movies
  const {
    data: trendingMovie,
    loading: trendingMovieLoading,
    error: trendingMovieError,
  } = useFetch(getTrendingMovie);

  //load movies
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: '',
    }),
  );
  const renderHeader = () => (
    <View className="px-5">
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <SearchBar
        onPress={() => router.push('/search')}
        placeholder="Search for a movie"
      />
      {trendingMovie && (
        <View className="mt-10">
          <Text className="text-lg text-white font-bold mb-3">
            Trending Movies:
          </Text>
        </View>
      )}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-4" />}
        className="mb-4 mt-3"
        data={trendingMovie}
        renderItem={({ item, index }) => (
          <TrendingCard movie={item} index={index}/>
        )}
        keyExtractor={(item) => item.movie_id.toString()}
      />
      <Text className="text-lg font-bold mb-3 mt-5 text-white">
        Latest Movies
      </Text>
    </View>
  );

  if (moviesLoading || trendingMovieLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full z-0" />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (moviesError || trendingMovieError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full z-0" />
        <Text className="text-red-500">
          Error: {moviesError?.message || trendingMovieError?.message}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pb-32 px-5"
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
}
