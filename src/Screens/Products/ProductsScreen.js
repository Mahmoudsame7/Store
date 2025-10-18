import { QueryClientContext, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlatList, View, Text, Image, ActivityIndicator, Button, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { DeleteProduct, FetchCategories, FetchProductByCategory, FetchProducts } from "../../Networking/ProductsService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsStorage, storage } from "../../LocalStorage/LocalStorage";
import Globals from "../../Utils/Globals";
// import { Theme } from "../../Utils/Themes";
import { Skeleton } from "@rneui/themed";
import { CloseCircle } from "iconsax-react-nativejs";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

function ProductsScreen({ navigation }) {

  const { theme } = useSelector((state) => state.theme);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => FetchProducts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    enabled: !selectedCategory,
  });

  const categoryInfo = useQuery({
    queryKey: ['categories'],
    queryFn: () => FetchCategories(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const ProductByCategory = useQuery({
    queryKey: ['product', selectedCategory],
    queryFn: () => FetchProductByCategory(selectedCategory),
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedCategory,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

  });



  const SetCachedProducts = async () => {
    try {
      const cachedData = JSON.stringify(data.pages);
      await AsyncStorage.setItem('cachedProducts', cachedData);
    } catch (error) {
      console.error('Error caching products:', error);
    }
  }

  // Cache products when data changes
  useEffect(() => {
    if (isSuccess && data?.pages) {
      // SetCachedProducts()
    } else if (isError) {
      Toast.show({
        type: 'failure',
        text1: error.message,
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      })
    }
    
    if (categoryInfo.isError) {
      Toast.show({
        type: 'failure',
        text1: categoryInfo.error.message,
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      })
    }
  }, [data, isSuccess, isError, categoryInfo.isError]);

  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.products) ?? [];
  }, [data]);

  const renderChip = ({ item }) => {
    const isSelected = selectedCategory === item;

    return (
      <TouchableOpacity
        style={[styles.chip, isSelected && {
          backgroundColor: theme.MainColor,
          borderColor: theme.MainColor,
        }]}
        onPress={() => {
          if (selectedCategory !== item) {
            setSelectedCategory(item)
          } else {
            setSelectedCategory(null)
          }
        }}
      >
        <Text style={[theme.chipTextStyle, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };



  const { mutate } = useMutation({
    mutationFn: (id) => DeleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['products'])

      const previousProducts = queryClient.getQueryData(['products'])

      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            products: page.products.filter((p) => p.id !== id),
          })),
        };
      });

      return { previousProducts }
    },

    onError: (err, id, onMutateResult) => {
      queryClient.setQueryData(['products'], onMutateResult.previousProducts);
    },



  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={[styles.productCard, { backgroundColor: theme.CardColor }]}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      {Globals.isAdmin == true && <TouchableOpacity
        onPress={() => mutate(item.id)}
        style={{ width: 70, height: 30, borderRadius: 10, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
        <Text style={{ color: 'white' }}>Delete</Text>
      </TouchableOpacity>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backColor }]}>


      <View style={styles.titleContainer}>
        <Text style={theme.headerStyle}>Products</Text>
      </View>







      <View style={styles.content}>
        {/* {categoryInfo.isError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No categories fetched</Text>
          </View>
        )} */}

        {categoryInfo.data && (
          <View style={styles.categoriesSection}>
            <Text style={[theme.headerStyle, styles.sectionTitle]}>Categories</Text>
            <FlatList
              data={categoryInfo.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id || item}
              renderItem={renderChip}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        {(isLoading || ProductByCategory.isLoading) && (
          <View style={{ flex: 1, marginTop: 10, gap: 10, alignItems: 'center' }}>
            <Skeleton width="90%" height={140} animation="wave" style={{ borderRadius: 12 }} />
            <Skeleton width="90%" height={140} animation="wave" style={{ borderRadius: 12 }} />
            <Skeleton width="90%" height={140} animation="wave" style={{ borderRadius: 12 }} />
            <Skeleton width="90%" height={140} animation="wave" style={{ borderRadius: 12 }} />
            <Skeleton width="90%" height={140} animation="wave" style={{ borderRadius: 12 }} />
          </View>
        )}
        {!selectedCategory ? (
          <FlatList
            data={products}
            onRefresh={refetch}
            refreshing={isFetching && !isFetchingNextPage}
            keyExtractor={(item) => item?.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.productsList}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={theme.MainColor} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.emptyContainer}>
                  <CloseCircle size={100} color={theme.MainColor} />
                  <Text style={[styles.emptyText, { width: '100%', textAlign: 'center',color:theme.MainColor }]}>No products found</Text>
                </View>
              ) : null
            }
          />


        ) : (
          <FlatList
            data={ProductByCategory.data?.products}
            keyExtractor={(item) => item?.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              !ProductByCategory.isLoading ? (
                <View style={[styles.emptyContainer]}>
                  <CloseCircle size={100} color={theme.MainColor} />
                  <Text style={[styles.emptyText, theme.MainColor, { width: '100%', textAlign: 'center',color:theme.MainColor }]}>No products in this category</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    paddingVertical: 16,
    // backgroundColor:'red'
  },
  sectionTitle: {

    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 25,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  // selectedChip: {
  //   backgroundColor: theme.MainColor,
  //   borderColor: theme.MainColor,
  // },
  // chipText: {
  //   ...theme.chipTextStyle
  // },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f1f3f5',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6c757d',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    paddingVertical: 80,
    gap: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 80,
    gap: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
  },
});

export default ProductsScreen;