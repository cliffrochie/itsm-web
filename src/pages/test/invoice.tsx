import { Document, Page, PDFViewer, Text, View, Image, Font } from "@react-pdf/renderer";
import { styles } from "./styles";
import NIALogo from '@/assets/images/2020-nia-logo.png'
import BagongPilipinasLogo from '@/assets/images/bagong-pilipinas.png'
import OPLogo from '@/assets/images/office-of-the-president.png'
import * as PDFTable from "@propra/react-pdf-table"
import TrajanProBoldFont from '@/assets/fonts/TRAJANPRO-BOLD.otf'
import TrajanProFont from '@/assets/fonts/TRAJANPRO-REGULAR.otf'




Font.register({
  family: 'Trajan-Pro-Bold',
  src: TrajanProBoldFont
})

Font.register({
  family: 'Trajan-Pro',
  src: TrajanProFont
})


export default function Invoice() {
  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: '2px' }}>
            <Image src={OPLogo} style={{ width: '50px', height: '50px' }} />
            <Image src={NIALogo} style={{ width: '50px', height: '50px' }} />
            <View style={{ justifyContent: 'center', marginLeft: '8px', gap: '1px' }}>
              <Text style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'Times-Bold', marginBottom: '2.5px' }}>Republic of the Philippines</Text>
              <Text style={{ fontSize: '10.5px', fontWeight: 'bold', fontFamily: 'Trajan-Pro-Bold' }}>NATIONAL IRRIGATION ADMINISTRATION</Text>
              <Text style={{ fontSize: '9px', fontFamily: 'Trajan-Pro' }}>REGIONAL OFFICE NO. XIII (CARAGA)</Text>
            </View>
          </View>
          <Image src={BagongPilipinasLogo} style={{ width: '50px', height: '50px' }} />
        </View>

        <View style={styles.spaceY}>
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
        </PDFTable.Table>
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