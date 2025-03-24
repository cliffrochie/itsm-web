import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#262626',
    fontFamily: 'Helvetica',
    fontSize: '12px',
    padding: '30px 50px',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px',
    gap: '2px'
  },
  title: {
   fontSize: '24px', 
  },
  textBold: {
    fontFamily: 'Helvetica-Bold',
  },
  spaceY: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  billTo: {
    marginBottom: '5px',
  }
});
