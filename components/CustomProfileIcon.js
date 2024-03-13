import { TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import SendToAwsS3Image from "./SendToAwsS3Image";

const CustomProfileIcon = ({ width, height, onPress, borderRadius }) => {
  const user = useSelector((state) => state.userInfo.user);
  const profileImageKey = user.profileImageKey;

  return (
    <TouchableOpacity onPress={onPress}>
      {profileImageKey ? (
        <SendToAwsS3Image
          imageKey={profileImageKey}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      ) : (
        <Image
          source={require("../assets/default-profile-icon.jpg")}
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
            borderWidth: 2,
            borderColor: "#ddd",
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomProfileIcon;
