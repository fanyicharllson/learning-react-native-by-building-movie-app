import { Client, Query, TablesDB, ID } from 'appwrite';
import { TMDB_CONFIG } from '../api';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    // Check if the search term already exists
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal('searchTerm', query)],
    });

    console.log('Existing search count result:', result);

    if (result.rows && result.rows.length > 0) {
      // Row exists, update the count
      const existingRow = result.rows[0];
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: existingRow.$id,
        data: {
          count: (existingRow.count || 0) + 1,
          // You can update other fields if needed, but not required
        },
      });
      console.log('Updated existing row count');
    } else {
      // Row doesn't exist, create it with all REQUIRED fields
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          movie_id: movie.id,
          title: movie.title,
        },
      });
      console.log('Created new row');
    }
  } catch (error) {
    console.error('Error updating search count:', error);
    throw error;
  }
};

export const getTrendingMovie = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc('count')],
    });
    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log('Error getting trending movie: ', error);
    return undefined;
  }
};

export const getMovieDetails = async (
  movieId: string,
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
      },
    );

    if (!response.ok) throw new Error('Failed to fetch movie details');

    const data = await response.json();
    return data as MovieDetails;
  } catch (error) {
    console.log('Error getting movie detI data: ', error);
    throw error;
  }
};
