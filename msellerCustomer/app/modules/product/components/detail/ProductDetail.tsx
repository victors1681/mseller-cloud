import React, {useCallback, useState} from 'react';
import {ImageBackground, SafeAreaView, ScrollView, View} from 'react-native';
import {
  Button,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import {getSourceImage} from 'app/utils';
import {Loading, Error, LoadingIndicator} from 'app/modules/common';
import {useCart, useProductDetail} from 'app/hooks';
import {useNavigation, useRoute} from '@react-navigation/core';
import {Stepper} from './Stepper';
import {ScreenLinks} from 'app/navigation/ScreenLinks';

export const ProductDetail: React.FC = (): React.ReactElement => {
  const [qty, setQty] = useState<number | string>(1);
  const navigation = useNavigation();
  const {params} = useRoute<any>();

  const {addItem, addItemInfo} = useCart();
  const productId = params?.productId as number;
  const styles = useStyleSheet(themedStyles);

  const {data, isLoading, error} = useProductDetail({productId});

  const product = data?.product;
  const onBuyButtonPress = async (): Promise<void> => {
    await handleAddItem();
    navigation && navigation.navigate(ScreenLinks.SHOPPING_CART);
  };

  const handleAddItem = useCallback(async (): Promise<void> => {
    await addItem(productId, qty as number);
  }, [productId, qty, addItem]);

  const renderHeader = (): React.ReactElement => (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.scrollView}>
        <Layout style={styles.header}>
          <ImageBackground
            style={styles.image}
            source={getSourceImage(product?.image?.sourceUrl as string)}
          />
          <Layout style={styles.detailsContainer} level="1">
            <Layout style={styles.titleAndPriceContainer}>
              <Text style={styles.title} category="h6">
                {product?.name || ''}
              </Text>
              <Text style={styles.price} category="h4">
                {product?.price}
              </Text>
            </Layout>

            <Text style={styles.subtitle} appearance="hint" category="p2">
              {product?.shortDescription || ''}
            </Text>
            <Text style={styles.subtitle} appearance="hint" category="p2">
              {product?.sku || ''}
            </Text>

            <Text style={styles.description} appearance="hint">
              {product?.description || ''}
            </Text>
            <Text style={styles.sectionLabel} category="h6">
              Cantidad:
            </Text>
            <Stepper qty={qty} setQty={setQty} />
            <View style={styles.actionContainer}>
              <Button
                style={styles.actionButton}
                size="giant"
                appearance="filled"
                disabled={addItemInfo.loading}
                onPress={onBuyButtonPress}>
                ORDENAR
              </Button>
              <Button
                style={styles.actionButton}
                size="giant"
                disabled={addItemInfo.loading}
                appearance="outline"
                accessoryLeft={addItemInfo.loading ? LoadingIndicator : null}
                onPress={handleAddItem}>
                {addItemInfo.loading ? 'Loading' : 'AGREGAR'}
              </Button>
            </View>
          </Layout>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return renderHeader();
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  commentList: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    marginBottom: 8,
  },
  image: {
    height: 340,
    width: '100%',
  },
  detailsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  titleAndPriceContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 2,
  },
  subtitle: {
    marginTop: 4,
  },
  price: {
    flex: 1,
  },
  description: {
    marginVertical: 16,
  },
  size: {
    marginBottom: 16,
  },
  colorGroup: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  colorRadio: {
    marginHorizontal: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  sectionLabel: {
    marginVertical: 8,
  },
  commentInputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'text-basic-color',
  },
  commentInput: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  wrapper: {
    flex: 1,
  },
  searchBar: {
    height: 60,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 0,
  },
});
