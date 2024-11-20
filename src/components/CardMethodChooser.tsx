import { Card, CardActionArea, CardHeader, CardMedia, Typography } from "@mui/material"


interface CardMethodChooserProp {
  title: string
  image: any
  action: () => void
}


const CardMethodChooser = (props: CardMethodChooserProp) => {

  const { title, image, action } = props

  return (
    <Card
      sx={{minWidth: 450, borderRadius: '40px'}}
      variant="elevation"
    >
      <CardActionArea onClick={action}>
        <CardHeader
          title={<Typography align="center" style={{fontSize: '1.6vw', fontWeight: 700}}>{ title }</Typography>}
        />
        <CardMedia
          component="img"
          height="400"
          image={image}
          alt="Imagen de rostro"
        />
      </CardActionArea>
    </Card>
  )
}

export default CardMethodChooser;