import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientTheme from '@/components/GradientTheme';
import ViewedTab from './viewed';
import PostedTab from './posted';

export default function LogsLayout() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('posted');

  const renderContent = () => {
    if (activeTab === 'viewed') {
      return <ViewedTab />;
    }
    return <PostedTab />;
  };

  return (
    <GradientTheme>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Custom Top Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'viewed' && styles.activeTab]}
            onPress={() => setActiveTab('viewed')}
          >
            <Text style={[styles.tabText, activeTab === 'viewed' && styles.activeTabText]}>
              VIEWED
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
            onPress={() => setActiveTab('posted')}
          >
            <Text style={[styles.tabText, activeTab === 'posted' && styles.activeTabText]}>
              POSTED
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </View>
    </GradientTheme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: 50,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#AAA',
  },
  activeTabText: {
    color: '#6200EE',
  },
  content: {
    flex: 1,
  },
});
