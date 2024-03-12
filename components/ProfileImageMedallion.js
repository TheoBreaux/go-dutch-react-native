import React from "react";
import { View } from "react-native";
import SendToAwsS3Image from "./SendToAwsS3Image";

const ProfileImageMedallion = ({
  profileImageKey,
  iconSize,
  width,
  height,
  borderRadius,
}) => {
  return (
    <View>
      <SendToAwsS3Image
        imageKey={profileImageKey}
        borderRadius={borderRadius}
        height={height}
        width={width}
      />
    </View>
  );
};

export default ProfileImageMedallion;
