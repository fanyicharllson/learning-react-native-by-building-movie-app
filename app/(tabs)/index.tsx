import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { useFetch } from '@/services/service_hooks/useFetch';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, View, Text, FlatList } from 'react-native';

export default function Index() {
  const router = useRouter();
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
      <Text className="text-lg font-bold mb-3 mt-5 text-white">
        Latest Movies
      </Text>
    </View>
  );

  if (moviesLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full z-0" />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (moviesError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full z-0" />
        <Text className="text-white">Error: {moviesError?.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <View className="px-5 mb-2">
            <Text className="text-white">{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 pb-32"
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
}
