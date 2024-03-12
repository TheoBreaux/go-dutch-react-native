import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import SendToAwsS3Image from "./SendToAwsS3Image";

const CustomProfileIcon = ({ width, height, onPress, borderRadius }) => {
  const user = useSelector((state) => state.userInfo.user);
  const profileImageKey = user.profileImageKey;

  return (
    <TouchableOpacity onPress={onPress}>
      <SendToAwsS3Image
        imageKey={profileImageKey}
        width={width}
        height={height}
        borderRadius={borderRadius}
      />
    </TouchableOpacity>
  );
};

export default CustomProfileIcon;
