import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const StatCard = ({ cash, transfer, credit, expense, netIncome, netSale, netCash, title, isSale, isExpense, isNet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box width="100%" m="0 30px" padding={0}>
      <Box display="flex" justifyContent="center">
        <Box>
        <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: colors.grey[100], marginRight: '10px', mb:'4px' }}
          >
           {title}
          </Typography>
        {isSale && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
        <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                In Cash:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px', fontFamily: 'Roboto'}}
            >
                {cash} Birr
            </Typography>
            </Box>}
           {isSale && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
           <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            > 
                In Transfer:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px'}}
            >
                {transfer} Birr
            </Typography>
            </Box>}
           { isSale && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
           <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                In Credit:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] }}
                style={{marginLeft:'10px'}}
            >
                {credit} Birr
            </Typography>
            </Box>}
            {isExpense && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'  }}>
           
            <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                Net Expense:
                </Typography> <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px'}}
            >
                {expense} Birr
            </Typography>
            </Box>}
            {isNet && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'  }}>
            <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                Net Sale:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px'}}
            >
                {netSale} Birr
            </Typography>
            </Box>}
            {isNet && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'  }}>
            <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                Net Income:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px'}}
            >
                {netIncome} Birr
            </Typography>
            </Box>}
            {isNet && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'  }}>
            <Typography
                variant="h5"
                sx={{ color: colors.grey[200] , ml:'5px', fontFamily: 'Roboto', fontSize:"15px"}}
            >
                Net Cash:
                </Typography>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: colors.grey[100] , ml:'5px'}}
            >
                {netCash} Birr
            </Typography>
            </Box>}
        </Box>
      </Box>
    </Box>
  );
};

export default StatCard;
