import React from "react";
import {View, Text, TouchableOpacity, PermisssionAndroid, PermissionsAndroid} from 'react-native';
// import RNFS from 'react-native-fs';
import {writeFile, readFile, DownladDirectoryPath } from 'react-native-fs';
import XLSX from 'xlsx';

export default function ExportCsv {
// function to handle export of file 
    const exportDataToExcel = () => {
        //data to export
        let data_to_export =[
            { type: "Income Jan", amount: 3000},
            { type: "Expense Jan", amount: 1800},
            { type: "Income Feb", amount: 4000},
            { type: "Expense feb", amount: 2500},
            { type: "Income Mar", amount: 8000},
            { type: "Expense Mar", amount: 7000},
        ];

        let wb = XLSX.utils.book_new();
        let wx = XLSX.utils.json_to_sheet(data_to_export);
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        const wbout =  XLSX.write(wb, {type:'binary', bookType: 'xlsx'});


        // write generated file to storage
        writeFile(
            DownladDirectoryPath + 'data.csv',
            wbout ,
            'ascii',
        )
        .then(res=>{
            alert('Export data successfully')
        })
        .catch(e => {
            console.log('error writing file', e);
        });
    };

    const handleClick = async () => {
        try {
            // check for permission (is it given?)
            let isPermittedExternalStorage = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );

            if (!isPermittedExternalStorage){
                //ask for permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage permission needed',
                        buttonNeutral: 'Ask me later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED){
                    //permission granted, calling export function
                    exportDataToExcel();
                    console.log('export successful')
                }else{
                    console.log('export failed, need permission to export')
                }
            }else{
                // permission already obtain
                exportDataToExcel();
            }
        }catch(e){
            console.log('Error while checking permission');
            console.log(e);
            return;
        }
    };
    
    return(
        <View
        style={{
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
        }}>
            <Text>EXPORT</Text>
            <TouchableOpacity
            onPress={() => handleClick()
            }>
            <Text> export to csv </Text>
            </TouchableOpacity>
        </View>
    );
};