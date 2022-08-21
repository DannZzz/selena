import { createCanvas } from "canvas";
import { ActionRow, ActionRowBuilder, AttachmentBuilder, MessageActionRowComponentResolvable } from "discord.js";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand({
  id: "colors",
  category: "Settings",
  data: new SlashBuilder("Administrator")
    .setName('colors')
    .setDescription('Управление цветными ролями.')
    .addSubcommand(cmd => cmd
      .setName("creat-role-color")
      .setDescription("Создать цветная роль и добавить в список.")
      .addStringOption(o => o
        .setName("color-name")
        .setDescription("Название цвета, напишите простое название, например: Red.")
        .setRequired(true)
      )
      .addStringOption(o => o
        .setName("hex-color")
        .setDescription("Цвет роли, HEX код или например RANDOM, для рандомного выбора.")
        .setRequired(true)
      )
    )
    .addSubcommand(cmd => cmd
      .setName("list")
      .setDescription("Посмотреть все цветные роли.")
    )
    .addSubcommand(cmd => cmd
      .setName("create-reaction")
      .setDescription("Создать реакцию на канале.")
    )
    .addSubcommand(cmd => cmd
      .setName("add-role")
      .setDescription("Добавить существующая роль в список.")
      .addRoleOption(o => o
        .setName("role")
        .setDescription("Роль сервера.")
        .setRequired(true)
      )
      .addStringOption(o => o
        .setDescription("Давать другое название в списке.")
        .setName("name")
      )
    )
    .addSubcommand(cmd => cmd
      .setName("delete-role-color")
      .setDescription("Удалить цветная роль.")
      .addIntegerOption(o => o
        .setName("number")
        .setDescription("Номер из списка цветов.")
        .setRequired(true)
      )
      .addStringOption(o => o
        .setDescription("Выбирай \"Да\", если не хочешь удалить роль.")
        .setName("no-delete")
        .setChoices(...toChoices([["Да", "yes"], ["Нет", "no"]]))
      )
    )
    .addSubcommand(cmd => cmd
      .setName("delete-all")
      .setDescription("Удалять все цвета из списка, и роли(выбор).")
      .addStringOption(o => o
        .setDescription("Выбирай \"Да\", если не хочешь удалить роли.")
        .setName("no-delete")
        .setChoices(...toChoices([["Да", "yes"], ["Нет", "no"]]))
      )
    )
    .addSubcommand(cmd => cmd
      .setName("create-random-color")
      .setDescription("Создать роль с рандомным цветом.")
    ),
  permissions: "Administrator",
  async execute ({ interaction, options, client, F, Builder, Database, thisGuild, isGuildPremium }) {
    const util = client.util;
    await interaction.deferReply({ephemeral: true});
    const guild = interaction.guild;
    const cmd = options.getSubcommand();
    const name = options.getString("name");
    const color = options.getString("hex-color");
    const dontDeleteRole = options.getString("no-delete");
    const indexSpec = options.getInteger("number");
    const roleSpec = options.getRole("role")
    
    const sd = thisGuild
    class Main {
      constructor() {

      }

      async interfaceAll() {
        const colors = await this.validColors()
        let h = 80;
        const canvas = createCanvas(2200, ((Math.ceil(colors.length / 2)) || 1) * 100)
        var ctx = canvas.getContext('2d')

        if (colors.length >this.limit) {
          colors.splice(0,this.limit);
          await Database.get("Guild").updateOne({ _id: guild.id }, { $set: { colors } })
        }

        colors.forEach((obj, i) => {
          let name = obj.name;
          if (!obj.name) {
            const role = guild.roles.cache.get(obj.id);
            name = role.name;
          };

          ctx.restore()
          ctx.save();

          ctx.fillStyle = obj.color;

          ctx.font = "bold 100px Calibri";
          ctx.fillText(util.shorten(`${i + 1}. ${name}`, 15), (i + 1) % 2 === 0 ? 1100 : 1, h)

          if ((i + 1) % 2 === 0) h += 100;


        })

        return canvas

      }

      async createColor(name, colorHex) {
        if (!this.checkMyPermission()) return;
        if (sd.colors.length >= this.limit) return Builder.createEmbed().setError(`Превышен лимит цветов!\n\nЛимит для обычных серверов: 10\nЛимит для **Премиум** серверов: 20`).editReply(interaction);
        const role = await guild.roles.create({
          name,
          color: ["BLACK", "000", "000000", "#000", "#000000"].includes(colorHex.toUpperCase()) ? "#010101" : colorHex.toUpperCase(),
          position: guild.members.me.roles.highest.position,
          reason: "Цветная роль",
        });

        await Database.get("Guild").updateOne({ _id: guild.id }, {
          $set: {
            colors: [...sd.colors, {
              name,
              color: colorHex.toUpperCase(),
              id: role.id
            }]
          }
        })

        Builder.createEmbed().setText(`Успешно добавлена цветная-роль: ${role}`).setColor(colorHex.toUpperCase()).editReply(interaction);
      }

      async deleteColor(index) {
        if (!this.checkMyPermission()) return;
        const colors = await this.validColors();
        const number = index - 1;
        const isExists = colors[number];
        if (!isExists) {
          return Builder.createEmbed().setError("Роль с этим номером не найдена.").editReply(interaction);
        } else {
          const removed = util.remove(colors, number);
          await Database.get("Guild").updateOne({ _id: guild.id }, { $set: { colors: removed } });
          if (dontDeleteRole !== "yes") guild.roles.delete(isExists.id);
          Builder.createEmbed().setSuccess("Цвет успешно удалён.").editReply(interaction);
        }
      }

      async addExistingRole(role, name = "") {
        if (!this.checkMyPermission()) return;
        const colors = await this.validColors();
        if (colors.length >= this.limit) return Builder.createEmbed().setError(`Превышен лимит цветов!\n\nЛимит для обычных серверов: 10\nЛимит для **Премиум** серверов: 20`).editReply(interaction);
        if (colors.find(obj => obj.id === role.id)) return Builder.createEmbed().setError("Эта роль уже есть в списке.").editReply(interaction);
        await Database.get("Guild").updateOne({ _id: guild.id }, {
          $set: {
            colors: [...sd.colors, {
              name: name || role.name,
              color: role.hexColor,
              id: role.id
            }]
          }
        });

        Builder.createEmbed().setText(`Успешно добавлена цветная-роль: ${role}`).setColor(role.hexColor).editReply(interaction);
      }

      async deleteColors() {
        if (!this.checkMyPermission()) return;
        const colors = await this.validColors();

        await Database.get("Guild").updateOne({ _id: guild.id }, { $set: { colors: [] } });
        if (dontDeleteRole !== "yes") {
          colors.forEach(obj => guild.roles.delete(obj.id))
        }
        Builder.createEmbed().setSuccess("Все мне доступные цвета будут удалены.").editReply(interaction)
      }

      async createRandomColor() {
        if (!this.checkMyPermission()) return;
        const role = await guild.roles.create({
          name: "Рандом-Цвет",
          color: "Random",
          position: guild.members.me.roles.highest.position,
          reason: "Цветная роль"
        });

        if (sd.colors.length < this.limit) await Database.get("Guild").updateOne({ _id: guild.id }, {
          $set: {
            colors: [...sd.colors, {
              color: role.hexColor,
              id: role.id
            }]
          }
        })

        Builder.createEmbed().setText(`Успешно добавлена цветная-роль: ${role}`).setColor(role.hexColor).editReply(interaction);
      }

      async createReaction() {
        const colors = await this.validColors();
        if (colors.length === 0) return Builder.createEmbed().setError("Сначала создайте цвета.").editReply(interaction);
        const canva = await this.interfaceAll();

        if (colors.length > this.limit) {
          colors.splice(0, this.limit);
          await Database.get("Guild").updateOne({ _id: guild.id }, { $set: { colors } })
        }

        let i = 1;

        const buttons = [];
        colors.forEach(obj => {
          buttons.push(
            Builder.createButton()
              .setLabel(`${i}`)
              .setStyle("Secondary")
              .setCustomId(`color-${obj.id}`)
              .toButtonBuilder()
          )
          i++;
        });

        // [button1, button2, buttonN]
        const rows = [];
        i = 0;

        function add() {
          const sliced: MessageActionRowComponentResolvable[] = buttons.slice(i, i + 5)
          i += 5;
          rows.push(new ActionRowBuilder().addComponents(sliced as any).toJSON());
          if (i < colors.length) {

            add();
          }
        }
        add();

        const att = new AttachmentBuilder(canva.toBuffer(), {name: "main.png"});

        const emb = Builder.createEmbed()
          .setImage(`attachment://main.png`)
          .setColor()
          .sendToChannel(interaction.channel, {files: [att], components: rows})

        interaction.followUp({ content: "Реакция успешно создана!" })

      }

      async validColors() {
        const filtered = sd?.colors?.filter(obj => guild.roles.cache.has(obj.id));
        if (filtered.length === sd?.colors?.length) return sd.colors;
        await Database.get("Guild").updateOne({ _id: guild.id }, { $set: { colors: filtered } });
        return filtered;
      }

      checkMyPermission() {
        if (!guild.members.me.permissions.has("ManageRoles")) {
          Builder.createEmbed().setError("У меня недостаточно прав.").editReply(interaction);
          return false;
        }
        return true;
      }

      get limit() {
        return isGuildPremium ? 20 : 10;
      }

    }
    const Class = new Main();
    switch (cmd) {
      case "create-role-color": {
        await Class.createColor(name, color);
        break;
      }
      case "list": {
        const image = await Class.interfaceAll();
        const att = new AttachmentBuilder(image.toBuffer(), {name: "main.png"});
        interaction.followUp({ files: [att] })
        break;
      }
      case "delete-role-color": {
        await Class.deleteColor(indexSpec);
        break;
      }
      case "create-reaction": {
        await Class.createReaction();
        break;
      }
      case "add-role": {
        await Class.addExistingRole(roleSpec, name);
        break;
      }
      case "delete-all": {
        await Class.deleteColors()
        break;
      }
      case "create-random-color": {
        await Class.createRandomColor()
        break;
      }

    }

  }

})