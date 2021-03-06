import React from 'react';
import {SliderBox} from 'react-native-image-slider-box';
import {useTheme} from '@ui-kitten/components';
import {usePromoPosts} from 'app/hooks';
import {useFocusEffect} from '@react-navigation/core';
export const ImageSlider = () => {
  const theme = useTheme();
  const {images, refetch} = usePromoPosts();

  useFocusEffect(
    React.useCallback(() => {
      if (images.length === 0) {
        refetch();
      }
    }, [refetch, images]),
  );

  const primaryColor = theme['color-primary-default'];
  const disabled = theme['color-primary-disabled'];
  const background = theme['background-basic-color-3'];
  const getImages = () =>
    images.length > 0
      ? images
      : [require('app/assets/images/image-placeholder.jpeg')];

  return (
    <SliderBox
      images={getImages()}
      sliderBoxHeight={140}
      onCurrentImagePressed={(index: number) =>
        console.warn(`image ${index} pressed`)
      }
      dotColor={primaryColor}
      inactiveDotColor={disabled}
      paginationBoxVerticalPadding={20}
      autoplay
      circleLoop
      resizeMethod={'resize'}
      resizeMode={'cover'}
      paginationBoxStyle={{
        position: 'absolute',
        bottom: 0,
        padding: 0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
        padding: 0,
        margin: 0,
        backgroundColor: {background},
      }}
      ImageComponentStyle={{
        borderRadius: 15,
        width: '97%',
        marginTop: 0,
        marginBottom: 8,
        marginRight: 20,
      }}
      imageLoadingColor={primaryColor}
    />
  );
};
