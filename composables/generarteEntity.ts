export function generateEntity(breed, x, y) {
  // copy defaufd breed keys
  const entity = JSON.parse(JSON.stringify(breedStore()[breed]));
  entity.breed = breed;

  // generates unique id
  if (entityStore().entitiesIds.length == 0) {
    entity.id = 0;
  } else {
    entity.id = Math.max(...entityStore().entitiesIds) + 1;
  }
  entityStore().entitiesIds.push(entity.id);

  entity.x = x;
  entity.y = y;
  entity.state = "idle";
  entity.animState = "idle";
  entity.stateStartFrame = commonStore().gameFrame;
  entity.mirrored = false;
  entity.health = entity.maxHealth;
  entity.mana = entity.maxMana;
  console.log(entity);
  entityStore().entities.push(entity);
}
