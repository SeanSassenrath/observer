import React, {useContext, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Layout, Text, Icon} from '@ui-kitten/components';

import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnknownFilesContext from '../contexts/unknownFiles';
import UserContext from '../contexts/userData';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {onAddMeditations} from '../utils/addMeditations';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const FilesScreen = () => {
  const [activeTab, setActiveTab] = useState<'matched' | 'unmatched'>('matched');
  
  const {user} = useContext(UserContext);
  const {meditationFilePaths, setMeditationFilePaths} = useContext(MeditationFilePathsContext);
  const {unknownFiles, setUnknownFiles} = useContext(UnknownFilesContext);
  const {meditationBaseData, setMeditationBaseData} = useContext(MeditationBaseDataContext);
  const navigation = useNavigation();

  const formatFileName = (filePath: string): string => {
    // Extract just the filename from the full path
    const fileName = filePath.split('/').pop() || 'Unknown file';
    
    // Decode URL encoding (like %20 for spaces)
    const decodedFileName = decodeURIComponent(fileName);
    
    // Extract file extension before cleaning
    const extensionMatch = decodedFileName.match(/\.(mp3|m4a|wav|aac|flac)$/i);
    const extension = extensionMatch ? extensionMatch[0] : '';
    
    // Remove file extension for cleaning
    const nameWithoutExtension = decodedFileName.replace(/\.(mp3|m4a|wav|aac|flac)$/i, '');
    
    // Clean up common prefixes and suffixes
    let cleanName = nameWithoutExtension
      .replace(/^(Dr\.?\s*Joe\s*(Dispenza)?[\s-]*)/i, '') // Remove "Dr Joe Dispenza" prefix
      .replace(/^(Joe\s*Dispenza[\s-]*)/i, '') // Remove "Joe Dispenza" prefix
      .replace(/[\s-]*\(.*?\)$/g, '') // Remove parentheses at the end
      .replace(/[\s-]*\[.*?\]$/g, '') // Remove brackets at the end
      .replace(/^[\d\s-]*/, '') // Remove leading numbers and dashes
      .replace(/[\s-]+/g, ' ') // Replace multiple spaces/dashes with single space
      .trim();
    
    // If the cleaned name is too short or empty, use the original filename
    if (cleanName.length < 3) {
      cleanName = nameWithoutExtension;
    }
    
    // Capitalize first letter and add extension back
    const finalName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    return finalName + extension;
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024 * 1024) {
      return `${Math.round(sizeInBytes / 1024)} KB`;
    } else {
      return `${Math.round(sizeInBytes / 1024 / 1024)} MB`;
    }
  };


  const handleFilePress = (meditationId: string, filePath: string, fileName: string) => {
    // @ts-ignore
    navigation.navigate('ReassignFile', {
      meditationId,
      filePath,
      fileName,
    });
  };

  const handleUploadFiles = async () => {
    try {
      const {_meditations, _unknownFiles} = await onAddMeditations(
        meditationFilePaths,
        setMeditationFilePaths,
        setUnknownFiles,
        user,
        setMeditationBaseData,
      );

      // Navigate to the matching results screen
      navigation.navigate('AddMedsMatching', {
        medsSuccess: _meditations,
        medsFail: _unknownFiles,
      });
    } catch (error) {
      console.log('File picker cancelled or error:', error);
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'matched' && styles.activeTab]}
        onPress={() => setActiveTab('matched')}
      >
        <Text style={[styles.tabText, activeTab === 'matched' && styles.activeTabText]}>
          Matched Files
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'unmatched' && styles.activeTab]}
        onPress={() => setActiveTab('unmatched')}
      >
        <Text style={[styles.tabText, activeTab === 'unmatched' && styles.activeTabText]}>
          Unmatched Files
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderMatchedFiles = () => {
    const matchedFilesArray = Object.entries(meditationFilePaths || {});
    
    if (matchedFilesArray.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="file-outline" style={styles.emptyIcon} fill="#6B7280" />
          <Text style={styles.emptyTitle}>No Matched Files</Text>
          <Text style={styles.emptyDescription}>
            You don't have any meditation files assigned to meditations yet. Upload files and assign them to meditations to see them here.
          </Text>
          <Button onPress={handleUploadFiles} style={styles.uploadButton}>
            Upload Files
          </Button>
        </View>
      );
    }

    return (
      <ScrollView style={styles.filesList}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Files Currently Assigned to Meditations</Text>
          <Text style={styles.sectionDescription}>
            View and manage files that have been matched to meditations
          </Text>
          
          {matchedFilesArray.map(([meditationId, filePath]) => {
            const meditation = meditationBaseData[meditationId];
            const formattedFileName = formatFileName(filePath);
            
            return (
              <TouchableOpacity 
                key={meditationId} 
                style={styles.fileItem}
                onPress={() => handleFilePress(meditationId, filePath, formattedFileName)}
              >
                <View style={styles.fileInfo}>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{formattedFileName}</Text>
                    <Text style={styles.meditationName}>
                      {meditation?.name || 'Unknown Meditation'}
                    </Text>
                  </View>
                  <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="#6B7280" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderUnmatchedFiles = () => {
    if (!unknownFiles || unknownFiles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="file-outline" style={styles.emptyIcon} fill="#6B7280" />
          <Text style={styles.emptyTitle}>No Unmatched Files</Text>
          <Text style={styles.emptyDescription}>
            All your uploaded files have been successfully matched to meditations. Upload more files to see them here if they can't be automatically matched.
          </Text>
          <Button onPress={handleUploadFiles} style={styles.uploadButton}>
            Upload Files
          </Button>
        </View>
      );
    }

    return (
      <ScrollView style={styles.filesList}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Unmatched Files</Text>
          <Text style={styles.sectionDescription}>
            Files that couldn't be automatically matched to meditations
          </Text>
          
          {unknownFiles.map((file, index) => {
            const formattedFileName = formatFileName(file.name || 'Unknown file');
            const formattedSize = file.size ? formatFileSize(file.size) : 'Unknown size';
            
            return (
              <TouchableOpacity key={index} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{formattedFileName}</Text>
                    <Text style={styles.fileSize}>{formattedSize}</Text>
                  </View>
                  <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="#6B7280" />
                </View>
              </TouchableOpacity>
            );
          })}
          
          <Button onPress={handleUploadFiles} style={styles.uploadButton}>
            Upload More Files
          </Button>
        </View>
      </ScrollView>
    );
  };


  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Meditation Files</Text>
          <Text style={styles.subtitle}>
            Manage your meditation audio files and their assignments
          </Text>
        </View>
        
        {renderTabBar()}
        
        <View style={styles.content}>
          {activeTab === 'matched' ? renderMatchedFiles() : renderUnmatchedFiles()}
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#374151',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    lineHeight: 20,
  },
  filesList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#1F2937',
    borderRadius: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meditationName: {
    fontSize: 14,
    color: '#9C4DCC',
  },
  fileSize: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  uploadButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
});

export default FilesScreen;