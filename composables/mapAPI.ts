export function mapSetup() {
  // empty array is needed for MapCollision to load before fetch
  for (let y = 0; y < 100; y++) {
    let row = [];
    for (let x = 0; x < 100; x++) {
      row.push(false);
    }
    mapStore().collision.push(row);
  }
  //
}

export function mapEditUpdate() {
  if (commonStore().gameFrame % 2 === 0) {
    mapStore().mapOffsetDelay[0] = mapStore().mapOffset[0];
    mapStore().mapOffsetDelay[1] = mapStore().mapOffset[1];
  }

  // edit
  if (gamepadStore().buttonsStatus.find((key) => key === "A")) {
    let hero = entityStore().entities.find((i) => i.id == 0);
    let x = Math.floor(hero.X / 120);
    let y = Math.floor(hero.Y / 120);
    mapStore().collision[y][x] = true;
  }

  if (commonStore().gameFrame % 60 === 0) {
    // useFetch("http://192.168.1.64:3000/api/devPost", {
    //   method: "POST",
    //   body: {
    //     name: "mapCollision",
    //     data: JSON.stringify(mapStore().collision),
    //   },
    // });
    // useFetch("http://192.168.1.64:3000/api/devGet", {
    //   method: "POST",
    //   body: {
    //     name: "mapCollision",
    //   },
    // }).then((res) => {});
    // console.log("data is sended to a server");
  }
}
