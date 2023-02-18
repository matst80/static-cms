import { Text } from "./Text";
import { Button } from "./Button";
import { Container, ContainerSettings } from "./Container";

export const Card = ({ background, padding = 20 }: any) => {
  return (
    <Container background={background} padding={padding}>
      <div className="text-only">
        <Text text="Title" fontSize={20} />
        <Text text="Subtitle" fontSize={15} />
      </div>
      <div className="buttons-only">
        <Button
          size="small"
          text="Learn more"
          variant="contained"
          color="primary"
        />
      </div>
    </Container>
  );
};

Card.craft = {
  related: {
    // Since Card has the same settings as Container, we'll just reuse ContainerSettings
    settings: ContainerSettings,
  },
};
