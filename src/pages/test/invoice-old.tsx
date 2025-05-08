import { Document, Page, PDFViewer, Text, View, Image, Font } from "@react-pdf/renderer";
import { styles } from "./styles";
import NIALogo from '@/assets/images/2020-nia-logo.png'
import BagongPilipinasLogo from '@/assets/images/bagong-pilipinas.png'
import OPLogo from '@/assets/images/office-of-the-president.png'
import TrajanProBold from '@/assets/fonts/TrajanPro-Bold.otf'
import TrajanPro from '@/assets/fonts/TrajanPro.otf'
import Cambria from '@/assets/fonts/Cambria.ttf'
import CambriaBold from '@/assets/fonts/Cambria-Bold.ttf'


Font.register({
  family: 'Trajan-Pro-Bold',
  src: TrajanProBold
})

Font.register({
  family: 'Trajan-Pro',
  src: TrajanPro
})

Font.register({
  family: 'Cambria-Bold',
  src: CambriaBold
})

Font.register({
  family: 'Cambria',
  src: Cambria
})


export default function Invoice() {
  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', gap: '2px'}}>
            <Image src={OPLogo} style={{ width: '50px', height: '50px'}} />
            <Image src={NIALogo} style={{ width: '50px', height: '50px'}} />
            <View style={{ justifyContent: 'center', marginLeft: '8px', gap: '1px'}}>
              <Text style={{fontSize: '10px', fontWeight: 'bold', fontFamily: 'Times-Bold', marginBottom: '2.5px'}}>Republic of the Philippines</Text>
              <Text style={{fontSize: '10.5px', fontWeight: 'bold', fontFamily: 'Trajan-Pro-Bold'}}>NATIONAL IRRIGATION ADMINISTRATION</Text>
              <Text style={{fontSize: '9px', fontFamily: 'Trajan-Pro'}}>REGIONAL OFFICE NO. XIII (CARAGA)</Text>
            </View>
          </View>
          <Image src={BagongPilipinasLogo} style={{width: '50px', height: '50px'}} />
        </View>

        <View style={{alignItems: 'center', marginBottom: '15px'}}>
          <Text style={styles.fontCambriaBold}>IT SERVICE TICKET</Text>
        </View>

        <View style={{flexDirection: 'row',}}>
          <View style={{marginRight: '110px'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>ITST No.:</Text>
              <Text style={styles.fontCambria}>PS-250307-001</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>Client Name:</Text>
              <Text style={{...styles.fontCambria, }}>Alberto P. Katigbak</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '8px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{marginRight: '125px'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '30px'}}>Date:</Text>
              <Text style={styles.fontCambria}>03/07/2025</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>Designation:</Text>
              <Text style={{...styles.fontCambria, }}>Sr. Computer Technician</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '8px'}}></View>

        <View style={{flexDirection: 'row',}}>
          <View style={{marginRight: '140.2px'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '27.3px'}}>Time:</Text>
              <Text style={styles.fontCambria}>10:30 AM</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>Division/Department:</Text>
              <Text style={{...styles.fontCambria, }}>RM's Office</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, borderBottomWidth: 1, marginBottom: '8px'}}></View>


        <View style={{marginBottom: '8px'}}>
          <Text style={styles.fontCambriaBold}>Nature of Work:</Text>
        </View>

        <View>
          <Text style={{...styles.fontCambria}}>Task/Problem reported:</Text>
        </View>
        <View style={{...styles.line, marginBottom: '23px'}}></View>
        <View style={{...styles.line, borderBottomWidth: 1, marginBottom: '8px'}}></View>

        <View style={{marginBottom: '8px'}}>
          <Text style={styles.fontCambriaBold}>Equipment/Device Details:</Text>
        </View>

        <View style={{flexDirection: 'row',}}>
          <View style={{marginRight: '110px'}}>
            <View style={{flexDirection: 'row' }}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>Serial No.:</Text>
              <Text style={styles.fontCambria}>DCEGTV295000034</Text>
            </View>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{...styles.fontCambria, marginRight: '10px'}}>Equipment Type:</Text>
              <Text style={{...styles.fontCambria, }}>Computer</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.line, marginBottom: '8px'}}></View>


        {/* <View style={styles.spaceY}>
          <Text style={[styles.billTo, styles.textBold]}>Bill to:</Text>
          <Text>Client Name</Text>
          <Text>Client Address</Text>
          <Text>City, State ZIP</Text>
        </View>

        <PDFTable.Table
          data={[
            {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"},
            {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"},
            {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"},
            {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"},
            {firstName: "John", lastName: "Smith", dob: new Date(2000, 1, 1), country: "Australia", phoneNumber: "xxx-0000-0000"},
          ]}
        >
          <PDFTable.TableHeader textAlign={"center"} fontSize={'10px'}> 
            <PDFTable.TableCell style={{padding: '3px'}}>
              First Name
            </PDFTable.TableCell>
            <PDFTable.TableCell style={{padding: '3px'}}>
              Last Name
            </PDFTable.TableCell>
            <PDFTable.TableCell style={{padding: '3px'}}>
              DOB
            </PDFTable.TableCell>
            <PDFTable.TableCell style={{padding: '3px'}}>
              Country
            </PDFTable.TableCell>
            <PDFTable.TableCell style={{padding: '3px'}}>
              Phone Number
            </PDFTable.TableCell>
          </PDFTable.TableHeader>
          <PDFTable.TableBody fontSize={'10px'}>
            <PDFTable.DataTableCell weighting={0.5} style={{padding: '3px'}} getContent={(r: any) => r.firstName}/>
            <PDFTable.DataTableCell weighting={0.5} style={{padding: '3px'}} getContent={(r: any) => r.lastName}/>
            <PDFTable.DataTableCell weighting={0.5} style={{padding: '3px'}} getContent={(r: any) => r.dob.toLocaleString()}/>
            <PDFTable.DataTableCell weighting={0.5} style={{padding: '3px'}} getContent={(r: any) => r.country}/>
            <PDFTable.DataTableCell weighting={0.5} style={{padding: '3px'}} getContent={(r: any) => r.phoneNumber}/>
          </PDFTable.TableBody>
        </PDFTable.Table> */}
      </Page>
    </Document>
  );


  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <InvoicePDF/>
      </PDFViewer>
    </div>
  )
}