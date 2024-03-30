import { View, FlatList } from "react-native";

import FavoriteRestaurantCard from "./FavoriteRestaurantCard";

const FavoriteRestaurantsList = ({ filteredFavoritedRestaurants }) => {
  const renderItem = ({ item }) => {
    return <FavoriteRestaurantCard item={item} />;
  };

  return (
    <View>
      <FlatList
        data={filteredFavoritedRestaurants}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={5}
      />
    </View>
  );
};

export default FavoriteRestaurantsList;
