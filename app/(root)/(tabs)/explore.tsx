import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/providers/global-provider'
import { router, useLocalSearchParams } from 'expo-router'
import { useAppwrite } from '@/hooks/useAppwrite'
import { getLatestProperties, getProperties } from '@/lib/appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, FeaturedCard } from '@/components/Cards'
import NoResults from '@/components/NoResults'
import icons from '@/constants/icons'
import Search from '@/components/Search'
import Filters from '@/components/Filters'

const Explore = () => {
    const { user } = useGlobalContext()
    const params = useLocalSearchParams<{ filter?: string, query?: string }>()

    const { data: latestProperties, loading: latestPropertiesLoading } = useAppwrite({
        fn: getLatestProperties,
    })

    const { data: properties, loading: propertiesLoading, refetch } = useAppwrite({
        fn: getProperties,
        params: {
            filter: params.filter!,
            query: params.query!,
            limit: 20
        },
        skip: true
    })

    useEffect(() => {
        refetch({
            filter: params.filter!,
            query: params.query!,
            limit: 20
        })
    }, [params.filter, params.query])

    const handleCardPress = (id: string) => {
        router.push(`/properties/${id}`)
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={properties}
                renderItem={({ item }) => (<Card item={item} onPress={() => handleCardPress(item.$id)} />)}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerClassName="pb-32"
                columnWrapperClassName="flex gap-5 px-6"
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                    propertiesLoading ? (
                        <ActivityIndicator size={"large"} className="text-primary-300 mt-5" />
                    ) : <NoResults />
                }
                ListHeaderComponent={
                    <View className='px-5'>
                        <View className='flex flex-row items-center justify-between mt-5'>
                            <TouchableOpacity onPress={() => router.back()} className='flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center'>
                                <Image source={icons.backArrow} className='w-5 h-5' />
                            </TouchableOpacity>
                            <Text className='text-base mr-2 text-center font-rubik-medium text-black-300'>
                                Search for Your  Ideal Home

                            </Text>
                            <Image source={icons.bell} className='w-6 h-6' />
                        </View>
                        <Search />
                        <View className='mt-5'>
                            <Filters />
                            <Text className='text-xl font-rubik-bold text-black-300 mt-5' >
                                Found {properties?.length} Properties
                            </Text>
                        </View>
                    </View>
                }
            />

        </SafeAreaView>
    );
}

export default Explore