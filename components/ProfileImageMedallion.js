import { StyleSheet, View, Image } from "react-native";

const ProfileImageMedallion = ({
  profileImagePath,
  iconSize,
  width,
  height,
  borderRadius,
}) => {
  return (
    <View>
      <Image
        source={{ uri: profileImagePath }}
        style={[
          styles.profilePic,
          {
            width: width || 40,
            height: height || 40,
            borderRadius: borderRadius || 20,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    resizeMode: "cover",
  },
});

export default ProfileImageMedallion;
